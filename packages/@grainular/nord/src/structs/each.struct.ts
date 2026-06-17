import type { Subscribable } from '../application/subscribable';
import type { ComponentFragment } from '../component/component-fragment';
import type { Fragment } from '../internals/fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import { type Settable, settable } from '../internals/settable';
import { createStruct } from './create-struct';

/**
 * `$each` is a struct for rendering a list of items into the DOM. It accepts
 * either a plain getter function or a `Subscribable` array and re-renders
 * efficiently when the list changes using keyed reconciliation.
 *
 * ```ts
 * const items = grain([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
 *
 * html`${$each(items)
 *     .$withKey(item => item.id)
 *     .$as(item => html`<p>${item.name}</p>`)
 * }`;
 * ```
 *
 * Use `$withKey` to provide a key function for stable identity across updates.
 * Without it, `$as` is used directly and items are keyed by value identity.
 *
 * If the source is a `Subscribable`, the list is kept in sync automatically.
 * Reconciliation uses a longest-increasing-subsequence algorithm to minimise
 * DOM moves when the list changes.
 */

type KeyFn<T> = (entry: T) => unknown;
type RenderFn<T> = (entry: T, idx: Subscribable<number>, arr: T[]) => ComponentFragment;

type EachStruct<T> = {
    /**
     * Renders each item using the provided template function, keyed by value
     * identity. Safe for lists of unique, stable object references. Avoid for
     * primitives or lists that may contain duplicate values — use `$withKey`
     * instead.
     */
    $as: (render: RenderFn<T>) => Fragment;

    /**
     * Provides a key function for stable item identity across reconciliation.
     * Recommended whenever items are primitives, may appear more than once,
     * or have unstable object references across updates.
     *
     * @param {KeyFn<T>} keyFn - A function that returns a unique key for each item.
     */
    $withKey: (keyFn: KeyFn<T>) => {
        /**
         * Renders each item using the provided template function, keyed by
         * the value returned from `$withKey`. This is the safest way to render
         * any list and should be preferred in most cases.
         */
        $as: (render: RenderFn<T>) => Fragment;
    };
};

/**
 * Creates a struct that renders and reconciles a list of items.
 *
 * @template T - The type of each item in the list.
 *
 * @param {(() => T[]) | Subscribable<T[]>} source - A getter function or
 * subscribable that returns the current list of items.
 *
 * @returns {EachStruct<T>} An object with `$as` and `$withKey` methods for
 * specifying how items are keyed and rendered. See each method for guidance
 * on when to use which.
 *
 * @example
 * ```ts
 * // With key — recommended for most cases
 * const users = grain([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
 *
 * html`${$each(users)
 *     .$withKey(user => user.id)
 *     .$as((user) => html`<li>${user.name}</li>`)
 * }`;
 * ```
 *
 * @example
 * ```ts
 * // Without key — only safe for lists of unique, stable object references
 * const items = grain([{ name: 'Alice' }, { name: 'Bob' }]);
 *
 * html`${$each(items)
 *     .$as((item) => html`<li>${item.name}</li>`)
 * }`;
 * ```
 */
export const $each = <T>(source: (() => T[]) | Subscribable<T[]>): EachStruct<T> => {
    const createEach = (keyFn: (value: T) => unknown, render: RenderFn<T>) =>
        createStruct(
            (anchor) => {
                const indexed = new Map<unknown, Settable<number>>();
                const cache = new Map<unknown, { nodes: Node[] }>();
                let prevKeys: unknown[] = [];

                const create = (item: T, idx: number, arr: T[]) => {
                    const reactiveIdx = settable(idx);
                    indexed.set(keyFn(item), reactiveIdx);
                    return {
                        nodes: hydrateFragment(render(item, reactiveIdx, arr)),
                    };
                };

                const insert = (nodes: Node[], cursor: Node) => {
                    const parent = cursor.parentNode;
                    const fragment = document.createDocumentFragment();
                    fragment.append(...nodes);
                    parent?.insertBefore(fragment, cursor);
                };

                const removeNodes = (nodes: Node[]) => {
                    for (const node of nodes) {
                        node.parentNode?.removeChild(node);
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
                        sources[i] = idx !== undefined ? idx : -1;
                    }

                    const newKeySet = new Set(keys);
                    for (const key of prevKeys) {
                        if (!newKeySet.has(key)) {
                            const entry = cache.get(key);

                            if (entry) {
                                removeNodes(entry.nodes);
                            }

                            cache.delete(key);
                            indexed.delete(key);
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
                        } else if (j < 0 || i !== seq[j]) {
                            if (entry) {
                                insert(entry.nodes, cursor);
                            }
                        } else {
                            j--;
                        }

                        indexed.get(key)?.set(i);

                        if (entry) {
                            cursor = entry.nodes[0];
                        }
                    }

                    prevKeys = keys;
                };

                reconcile(source());

                if (isSubscribableValue(source)) {
                    const unsubscribe = source.subscribe(reconcile);
                    return () => {
                        unsubscribe?.();
                        cache.forEach(({ nodes }) => {
                            removeNodes(nodes);
                        });
                    };
                }
            },
            () =>
                source()
                    .map((value, idx, arr) => render(value, settable(idx), arr).render())
                    .join(''),
        );

    return {
        $as: (render: RenderFn<T>) => createEach((value) => value, render),
        $withKey: (keyFn: KeyFn<T>) => ({
            $as: (render: RenderFn<T>) => createEach(keyFn, render),
        }),
    };
};

/**
 * Computes the longest increasing subsequence (LIS) of the given source
 * indices. Used during reconciliation to determine the minimal set of DOM
 * moves required to update the list.
 *
 * Indices of `-1` denote new items with no previous position and are skipped.
 *
 * @param {Int32Array} sourceIndices - An array mapping each new item's
 * position to its previous position, or `-1` if it is newly inserted.
 *
 * @returns {number[]} The values at the LIS positions in `sourceIndices`.
 */
function getLIS(sourceIndices: Int32Array): number[] {
    const predecessors = new Int32Array(sourceIndices.length);
    const tails: number[] = [];

    predecessors.fill(-1);

    for (let i = 0; i < sourceIndices.length; i++) {
        const value = sourceIndices[i];

        // New items are not part of the stable subsequence
        if (value === -1) continue;

        let low = 0;
        let high = tails.length;

        while (low < high) {
            const mid = (low + high) >> 1;

            if (sourceIndices[tails[mid]] < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        if (low > 0) {
            predecessors[i] = tails[low - 1];
        }

        tails[low] = i;
    }

    if (tails.length === 0) return [];

    const result = new Array<number>(tails.length);
    let current = tails[tails.length - 1];

    for (let i = tails.length - 1; i >= 0; i--) {
        result[i] = current;
        current = predecessors[current];
    }

    return result;
}
