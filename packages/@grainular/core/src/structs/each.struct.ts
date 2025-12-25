import type { Subscribable, TemplateResult } from '../component/template-parser';
import { hydrateTemplate } from '../internals/hydrate-template.ts';
import { isSubscribable } from '../internals/is-subscribable';
import { createStruct } from './create-struct';

type NodeEntry<T> = {
    data: T;
    node: Element;
};

export const $each = <T>(
    dataSource: (() => Array<T>) & Partial<Subscribable<Array<T>>>,
    compare?: (prev: T, current: T) => boolean,
) => {
    // Internal struct builder to avoid code duplication between .$as() and .$withKey().$as()
    const createEachStruct = (
        keyFn: (entry: T) => unknown,
        render: (entry: T, index: number, arr: Array<T>) => TemplateResult,
    ) => {
        return createStruct((anchor: Comment) => {
            // The cache persists node references between renders
            const cache = new Map<unknown, NodeEntry<T>>();

            // Helper: Hydrates the template and extracts the root element safely
            const createNode = (item: T, index: number, arr: T[]): Element => {
                const nodes = hydrateTemplate(render(item, index, arr));
                // Prefer the first generic Element, fallback to the first node (for text-only templates)
                return (nodes.find((n) => n.nodeType === 1) || nodes[0]) as Element;
            };

            const reconcile = (items: T[]) => {
                // 1. FAST PATH: Clear All
                if (items.length === 0) {
                    if (cache.size > 0) {
                        for (const entry of cache.values()) entry.node.remove();
                        cache.clear();
                    }
                    return;
                }

                // 2. FAST PATH: Initial Render (Forward Append)
                // Much faster for first paint as it avoids layout thrashing by using a Fragment
                if (cache.size === 0) {
                    const fragment = document.createDocumentFragment();
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        const key = keyFn(item);

                        const node = createNode(item, i, items);
                        cache.set(key, { node, data: item });
                        fragment.appendChild(node);
                    }
                    anchor.parentElement?.insertBefore(fragment, anchor);
                    return;
                }

                // 3. RECONCILIATION PATH (Backwards Iteration)
                // Iterating backwards provides a stable 'cursor' reference (starting with anchor),
                // making moves and inserts strictly O(N) without complex index math.
                const keysInUse = new Set<unknown>();
                let cursor: Node | null = anchor;

                for (let i = items.length - 1; i >= 0; i--) {
                    const item = items[i];
                    const key = keyFn(item);
                    keysInUse.add(key);

                    let entry = cache.get(key);

                    // Case A: Create New
                    if (!entry) {
                        const node = createNode(item, i, items);
                        entry = { node, data: item };
                        cache.set(key, entry);
                    }
                    // Case B: Update Existing
                    else {
                        const hasChanged = compare ? !compare(entry.data, item) : entry.data !== item;

                        if (hasChanged) {
                            const newNode = createNode(item, i, items);
                            entry.node.replaceWith(newNode);
                            entry.node = newNode;
                            entry.data = item;
                        }
                    }

                    // Placement Check: Ensure node is strictly before the cursor
                    if (entry.node.nextSibling !== cursor) {
                        anchor.parentElement?.insertBefore(entry.node, cursor);
                    }

                    // Move cursor backwards
                    cursor = entry.node;
                }

                // 4. Cleanup Stale Nodes
                if (cache.size !== keysInUse.size) {
                    for (const [key, entry] of cache) {
                        if (!keysInUse.has(key)) {
                            entry.node.remove();
                            cache.delete(key);
                        }
                    }
                }
            };

            // Initialize & Subscribe
            reconcile(dataSource());
            if (isSubscribable(dataSource)) {
                return dataSource.subscribe(reconcile);
            }
        });
    };

    // Fluent API Surface
    return {
        $withKey: (keyFn: (entry: T) => unknown) => ({
            $as: (render: (entry: T, index: number, arr: Array<T>) => TemplateResult) =>
                createEachStruct(keyFn, render),
        }),
        $as: (render: (entry: T, index: number, arr: Array<T>) => TemplateResult) =>
            createEachStruct((entry) => entry, render),
    };
};
