import { disconnectNodes } from '../application/lifecycle-observer';
import type { ComponentFragment } from '../component/component-fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import type { Subscribable } from '../internals/subscribable';
import { createStruct } from './create-struct';

type CachedEntry<T> = { data: T; nodes: Element[] };
type KeyFn<T> = (entry: T) => unknown;
type RenderFn<T> = (entry: T, idx: number, arr: T[]) => ComponentFragment;
/**
 * Creates a declarative list renderer that efficiently reconciles DOM nodes
 * based on item identity and optional keys.
 *
 * ## Core behavior
 *
 * `$each` renders a list of items into the DOM and keeps it in sync when the
 * source list changes. It uses a cache of previously rendered entries to
 * minimize DOM operations where possible.
 *
 * ### Identity & updates
 *
 * By default, list items are compared by **reference identity**:
 *
 * - If the same item reference appears again, its existing DOM nodes are reused.
 * - If a new item reference replaces a previous one, the old nodes are
 *   disconnected and new nodes are rendered.
 * - In-place mutation of an existing item **does not trigger a rerender**.
 *
 * This means `$each` follows **identity-based rendering**, not value-based
 * diffing.
 *
 * An optional `compareFn` can be provided to override this behavior and control
 * when an item should be considered changed.
 *
 * ### Keys
 *
 * `$each` supports keyed lists via `$withKey`. Keys are used to associate items
 * with cached DOM nodes across renders.
 *
 * - If an item with the same key appears again and is considered unchanged,
 *   its DOM nodes are reused and moved if necessary.
 * - If an item with the same key is considered changed (by identity or
 *   `compareFn`), its nodes are replaced.
 * - If a key disappears from the list, its associated nodes are disconnected.
 *
 * Keys are **not** used to determine equality by themselves; they only define
 * cache slots.
 *
 * ### Reordering
 *
 * Reordering items with stable identity and keys will move existing DOM nodes
 * without recreating them.
 *
 * Reordering items with new identities (even if keys match) will recreate the
 * affected nodes.
 *
 * ### Empty lists
 *
 * When the list becomes empty, all previously rendered nodes are disconnected
 * and the internal cache is cleared.
 *
 * ### Static vs dynamic sources
 *
 * - If the source is a plain function returning an array, the list is rendered
 *   once and treated as static.
 * - If the source is a subscribable value, `$each` subscribes to it and
 *   reconciles the list whenever it updates.
 *
 * ## Example
 *
 * ```ts
 * const items = grain([{ id: 1, name: 'A' }]);
 *
 * html`
 *   <ul>
 *     ${$each(items)
 *       .$withKey(item => item.id)
 *       .$as(item => html`<li>${item.name}</li>`)}
 *   </ul>
 * `;
 * ```
 *
 * @typeParam T - The item type of the list.
 * @param source - A function returning an array or a subscribable array.
 * @param compareFn - Optional comparison function to determine whether an
 *                    existing item should be rerendered.
 */
export const $each = <T>(source: (() => T[]) | Subscribable<T[]>, compareFn?: (prev: T, current: T) => boolean) => {
    const createEachStruct = (keyFn: KeyFn<T>, render: RenderFn<T>) => {
        return createStruct(
            (anchor) => {
                // We create a cache map to hold nodes by their
                // node keys, this allows efficient diffing later
                const cache = new Map<unknown, CachedEntry<T>>();

                const createNodes = (item: T, idx: number, arr: T[]) => {
                    return hydrateFragment(render(item, idx, arr));
                };

                const reconcileNodes = (items: T[]) => {
                    const root = anchor.parentNode;

                    // Bail if the anchor is detached
                    if (!root) return;

                    // If all items have been deleted, we can
                    // simple detach all of them
                    if (items.length === 0 && cache.size > 0) {
                        for (const entry of cache.values()) disconnectNodes(entry.nodes);
                        cache.clear();
                        return;
                    }

                    // If the cache is empty, we can render all nodes directly,
                    // this is likely the initial render. This also means we
                    // have a fast iteration here for static lists.
                    if (cache.size === 0) {
                        const fragment = document.createDocumentFragment();

                        // Iterate to create the nodes, append them to the
                        // fragment.
                        items.forEach((item, idx, arr) => {
                            const key = keyFn(item);
                            const nodes = createNodes(item, idx, arr);
                            cache.set(key, { nodes, data: item });
                            fragment.append(...nodes);
                        });

                        root.insertBefore(fragment, anchor);
                        return; // Return early, nothing lef to do
                    }

                    // Reconciliation process, which will be used when
                    // we have nodes and a already existing cache, indicating
                    // a updated list to render
                    const currentUsedKeys = new Set<unknown>();
                    let cursor: Node | null = anchor;

                    // We iterate backwards to ensure stable iteration
                    for (let idx = items.length - 1; idx >= 0; idx--) {
                        const item = items[idx];
                        const key = keyFn(item);
                        currentUsedKeys.add(key);

                        let entry = cache.get(key);

                        // If there is no entry from the cache,
                        // we have a new node and need to render
                        // this one accordingly
                        if (!entry) {
                            const nodes = createNodes(item, idx, items);
                            entry = { nodes, data: item };
                            cache.set(key, entry);
                        }

                        // If a entry exists, we can check
                        // if it has changed, and if we should update
                        // or move it.
                        else {
                            const changed = compareFn?.(entry.data, item) ?? entry.data !== item;

                            // If the nodes have changed, create the new ones
                            // and disconnect the old ones
                            if (changed) {
                                const nodes = createNodes(item, idx, items);
                                disconnectNodes(entry.nodes);
                                entry.nodes = nodes;
                                entry.data = item;
                            }
                        }

                        const lastNode = entry.nodes[entry.nodes.length - 1];
                        if (lastNode.nextSibling !== cursor) {
                            for (const node of entry.nodes) root.insertBefore(node, cursor);
                        }

                        // Move the respective cursor to the new processed
                        // node, to allow further iteration.
                        cursor = entry.nodes[0];
                    }

                    // We also need to cleanup all nodes that have not
                    // been used and are still in our cache.
                    if (cache.size !== currentUsedKeys.size) {
                        for (const [key, entry] of cache) {
                            if (!currentUsedKeys.has(key)) {
                                disconnectNodes(entry.nodes);
                                cache.delete(key);
                            }
                        }
                    }
                };

                // Render the first set of nodes directly from
                // the passed data.
                reconcileNodes(source());

                // Subscribe to the source if it is a subscribable,
                // and keep reconciling once the data updates.
                if (isSubscribableValue(source)) {
                    return source.subscribe(reconcileNodes);
                }
            },
            () => {
                return source()
                    .map((item, idx, arr) => {
                        return render(item, idx, arr).render();
                    })
                    .join('');
            },
        );
    };

    return {
        $as: (renderFn: RenderFn<T>) => createEachStruct((entry) => entry, renderFn),
        $withKey: (keyFn: KeyFn<T>) => ({
            $as: (renderFn: RenderFn<T>) => createEachStruct(keyFn, renderFn),
        }),
    };
};
