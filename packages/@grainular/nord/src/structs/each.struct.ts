import type { ComponentFragment } from '../component/component-fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import type { Subscribable } from '../internals/subscribable';
import { createStruct } from './create-struct';

type KeyFn<T> = (entry: T) => unknown;
type RenderFn<T> = (entry: T, idx: number, arr: T[]) => ComponentFragment;

export const $each = <T>(source: (() => T[]) | Subscribable<T[]>) => {
    const createEachStruct = (keyFn: KeyFn<T>, render: RenderFn<T>) => {
        return createStruct(
            (anchor) => {
                const cache = new Map();
                let prevItems: T[] = [];
                let prevKeys: unknown[] = [];
                const root = anchor.parentNode;

                const create = (item: T, i: number, arr: T[]) => {
                    const nodes = hydrateFragment(render(item, i, arr));
                    return { nodes };
                };

                const removeRange = (startIdx: number, endIdx: number) => {
                    const startNode = cache.get(prevKeys[startIdx])?.nodes[0];
                    const endNode = cache.get(prevKeys[endIdx])?.nodes.at(-1);

                    if (startNode && endNode) {
                        const range = document.createRange();
                        range.setStartBefore(startNode);
                        range.setEndAfter(endNode);
                        range.deleteContents();
                    }
                };

                const insertNodes = (nodes: Node[], ref: Node) => {
                    const frag = document.createDocumentFragment();
                    for (const node of nodes) frag.appendChild(node);
                    root?.insertBefore(frag, ref);
                };

                const reconcile = (items: T[]) => {
                    if (!root) return;
                    const len = items.length;

                    if (!len) {
                        if (cache.size) {
                            removeRange(0, prevKeys.length - 1);
                            cache.clear();
                            prevItems = [];
                            prevKeys = [];
                        }
                        return;
                    }

                    if (!prevItems.length) {
                        const frag = document.createDocumentFragment();
                        const newKeys: unknown[] = [];

                        items.forEach((item, i) => {
                            const key = keyFn(item);
                            newKeys.push(key);
                            const entry = create(item, i, items);
                            cache.set(key, entry);
                            for (const node of entry.nodes) frag.appendChild(node);
                        });

                        root.insertBefore(frag, anchor);
                        prevItems = items;
                        prevKeys = newKeys;
                        return;
                    }

                    // Cache all keys upfront
                    const newKeys = items.map(keyFn);

                    let oldStart = 0;
                    let oldEnd = prevKeys.length - 1;
                    let newStart = 0;
                    let newEnd = len - 1;

                    while (oldStart <= oldEnd && newStart <= newEnd) {
                        if (prevKeys[oldStart] !== newKeys[newStart]) break;
                        oldStart++;
                        newStart++;
                    }

                    let lastCursor = anchor;
                    while (oldStart <= oldEnd && newStart <= newEnd) {
                        const newKey = newKeys[newEnd];
                        if (prevKeys[oldEnd] !== newKey) break;

                        const entry = cache.get(newKey);
                        if (entry) lastCursor = entry.nodes[0];
                        oldEnd--;
                        newEnd--;
                    }

                    if (oldStart > oldEnd) {
                        for (let i = newStart; i <= newEnd; i++) {
                            const item = items[i];
                            const key = newKeys[i];
                            const entry = create(item, i, items);
                            cache.set(key, entry);
                            insertNodes(entry.nodes, lastCursor);
                        }
                    } else if (newStart > newEnd) {
                        removeRange(oldStart, oldEnd);
                        for (let i = oldStart; i <= oldEnd; i++) {
                            cache.delete(prevKeys[i]);
                        }
                    } else {
                        const keyToOldIndex = new Map();
                        for (let i = oldStart; i <= oldEnd; i++) {
                            keyToOldIndex.set(prevKeys[i], i);
                        }

                        const count = newEnd - newStart + 1;
                        const sources = new Int32Array(count).fill(-1);
                        let patched = 0;

                        for (let i = newStart; i <= newEnd; i++) {
                            const idx = keyToOldIndex.get(newKeys[i]);
                            if (idx !== undefined) {
                                sources[i - newStart] = idx;
                                patched++;
                            }
                        }

                        if (patched === 0) {
                            removeRange(oldStart, oldEnd);
                            for (let i = oldStart; i <= oldEnd; i++) {
                                cache.delete(prevKeys[i]);
                            }
                        } else {
                            const newKeysSet = new Set(newKeys.slice(newStart, newEnd + 1));
                            for (let i = oldStart; i <= oldEnd; i++) {
                                const key = prevKeys[i];
                                if (!newKeysSet.has(key)) {
                                    const entry = cache.get(key);
                                    if (entry) {
                                        for (const node of entry.nodes) node.remove();
                                        cache.delete(key);
                                    }
                                }
                            }
                        }

                        const seq = getLIS(sources);
                        let j = seq.length - 1;

                        for (let i = count - 1; i >= 0; i--) {
                            const idx = newStart + i;
                            const item = items[idx];
                            const key = newKeys[idx];

                            if (sources[i] === -1) {
                                const entry = create(item, idx, items);
                                cache.set(key, entry);
                                insertNodes(entry.nodes, lastCursor);
                            } else {
                                if (j >= 0 && sources[i] === seq[j]) {
                                    j--;
                                } else {
                                    const entry = cache.get(key);
                                    if (entry) {
                                        insertNodes(entry.nodes, lastCursor);
                                    }
                                }
                            }

                            const entry = cache.get(key);
                            if (entry) lastCursor = entry.nodes[0];
                        }
                    }

                    prevItems = items;
                    prevKeys = newKeys;
                };

                reconcile(source());
                if (isSubscribableValue(source)) return source.subscribe(reconcile);
            },
            () =>
                source()
                    .map((item, idx, arr) => render(item, idx, arr).render())
                    .join(''),
        );
    };

    return {
        $as: (renderFn: RenderFn<T>) => createEachStruct((entry) => entry, renderFn),
        $withKey: (keyFn: KeyFn<T>) => ({
            $as: (renderFn: RenderFn<T>) => createEachStruct(keyFn, renderFn),
        }),
    };
};

// LIS is a modern approach to determine the minimal
// amount of moves necessary to reconcile a list of
// elements. This is a moderately complex calculation,
// however DOM overhead will make this a non issue
function getLIS(input: Int32Array): number[] {
    // 'predecessors' lets us reconstruct the path by tracking the previous index
    // for every element that becomes part of the subsequence.
    const predecessors = new Int32Array(input.length);

    // 'indices' stores the indices of the smallest tail of all increasing subsequences.
    // indices[k] = index of the value ending a subsequence of length k+1
    const indices = [0];

    const len = input.length;
    for (let i = 0; i < len; i++) {
        const value = input[i];

        // Ignore placeholder values (-1 indicates a new item in diffing)
        if (value === -1) continue;

        // Check if the current value is larger than the tail of our longest sequence
        const lastIndex = indices[indices.length - 1];
        if (input[lastIndex] < value) {
            predecessors[i] = lastIndex;
            indices.push(i);
            continue;
        }

        // Binary Search: Find the smallest tail that is >= current value
        // We replace it to maintain the "potential" for longer sequences later.
        let low = 0;
        let high = indices.length - 1;

        while (low < high) {
            // Unsigned bit shift for efficient floor division
            const mid = (low + high) >>> 1;
            if (input[indices[mid]] < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        // If we found a valid replacement spot
        if (value < input[indices[low]]) {
            if (low > 0) {
                predecessors[i] = indices[low - 1];
            }
            indices[low] = i;
        }
    }

    // Backtrack to reconstruct the actual sequence of values
    let i = indices.length;
    let current = indices[i - 1];

    while (i-- > 0) {
        indices[i] = input[current];
        current = predecessors[current];
    }

    return indices;
}
