import type { ComponentFragment } from '../component/component-fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import type { Subscribable } from '../internals/subscribable';
import { createStruct } from './create-struct';

type KeyFn<T> = (entry: T) => unknown;
type RenderFn<T> = (entry: T, idx: number, arr: T[]) => ComponentFragment;

export const $each = <T>(source: (() => T[]) | Subscribable<T[]>) => {
    const createEach = (keyFn: (value: T) => unknown, render: RenderFn<T>) =>
        createStruct(
            (anchor) => {
                const root = anchor.parentNode;
                if (!root) return;

                const cache = new Map<unknown, { nodes: Node[] }>();
                let prevKeys: unknown[] = [];

                const create = (item: T, idx: number, arr: T[]) => ({
                    nodes: hydrateFragment(render(item, idx, arr)),
                });

                const insert = (nodes: Node[], ref: Node) => {
                    const fragment = document.createDocumentFragment();
                    for (const node of nodes) fragment.appendChild(node);
                    root.insertBefore(fragment, ref);
                };

                const removeNodes = (nodes: Node[]) => {
                    for (const node of nodes) {
                        const parent = node.parentNode;
                        if (parent) parent.removeChild(node);
                    }
                };

                const reconcile = (items: T[]) => {
                    const keys = items.map(keyFn);
                    const keyIndex = new Map<unknown, number>();

                    for (let i = 0; i < prevKeys.length; i++) {
                        keyIndex.set(prevKeys[i], i);
                    }

                    const sources = new Int32Array(keys.length).fill(-1);
                    for (let i = 0; i < keys.length; i++) {
                        const idx = keyIndex.get(keys[i]);
                        if (idx !== undefined) sources[i] = idx;
                    }

                    // remove stale entries
                    for (const key of prevKeys) {
                        if (!keys.includes(key)) {
                            const entry = cache.get(key);
                            if (entry) removeNodes(entry.nodes);
                            cache.delete(key);
                        }
                    }

                    const seq = getLIS(sources);
                    let j = seq.length - 1;
                    let cursor: Node = anchor;

                    for (let i = keys.length - 1; i >= 0; i--) {
                        const key = keys[i];
                        let entry = cache.get(key);

                        if (sources[i] === -1) {
                            entry = create(items[i], i, items);
                            cache.set(key, entry);
                            insert(entry.nodes, cursor);
                        } else if (j < 0 || sources[i] !== seq[j]) {
                            if (entry) insert(entry.nodes, cursor);
                        } else {
                            j--;
                        }

                        if (entry) cursor = entry.nodes[0];
                    }

                    prevKeys = keys;
                };

                reconcile(source());
                if (isSubscribableValue(source)) {
                    return source.subscribe(reconcile);
                }
            },
            () =>
                source()
                    .map((value, idx, arr) => render(value, idx, arr).render())
                    .join(''),
        );

    return {
        $as: (render: RenderFn<T>) => createEach((value) => value, render),
        $withKey: (keyFn: KeyFn<T>) => ({
            $as: (render: RenderFn<T>) => createEach(keyFn, render),
        }),
    };
};

// LIS is a modern approach to determine the minimal
// amount of moves necessary to reconcile a list of
// elements. This is a moderately complex calculation,
// however DOM overhead will make this a non issue
function getLIS(sourceIndices: Int32Array): number[] {
    // Tracks the predecessor index for each element
    const predecessors = sourceIndices.slice();

    // Stores indices of the smallest tail value for each LIS length
    const tails: number[] = [];

    for (let currentIndex = 0; currentIndex < sourceIndices.length; currentIndex++) {
        const value = sourceIndices[currentIndex];
        if (value === -1) continue;

        let low = 0;
        let high = tails.length;

        // Binary search for the insertion point
        while (low < high) {
            const mid = (low + high) >> 1;
            if (sourceIndices[tails[mid]] < value) low = mid + 1;
            else high = mid;
        }

        if (low > 0) {
            predecessors[currentIndex] = tails[low - 1];
        }

        tails[low] = currentIndex;
    }

    // Reconstruct LIS by backtracking through predecessors
    let length = tails.length;
    let current = tails[length - 1];

    while (length--) {
        tails[length] = sourceIndices[current];
        current = predecessors[current];
    }

    return tails;
}
