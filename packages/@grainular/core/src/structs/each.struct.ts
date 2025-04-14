import type { ComponentFragment } from '../component/component-fragment';
import type { Subscribable } from '../component/template-parser';
import { DOM } from '../internals/dom';
import { isSubscribable } from '../internals/is-subscribable';
import { Symbols } from '../internals/symbols';

export const $each = <T>(
    itt: (() => Array<T>) | Subscribable<Array<T>>,
    compare?: (prev: T, current: T) => boolean,
) => {
    return {
        $withKey: (key: (predicate: T) => string | number) => {
            return {
                $as: (run: (entry: T, index: number, arr: Array<T>) => ComponentFragment | string | null) => {
                    // Store initial state
                    const initial = itt();
                    // Map to store fragments by key
                    const fragmentCache = new Map<string | number, DocumentFragment>();
                    // Map to store previous values for comparison
                    const previousValues = new Map<string | number, T>();

                    const struct = (root: Comment) => {
                        root.textContent += '$each:';
                        let currentNodes: Element[] = [];

                        const updateDOM = (items: Array<T>) => {
                            // Remove all existing nodes
                            DOM.removeNodes(currentNodes);
                            currentNodes = [];

                            // Process each item
                            items.forEach((item, index, arr) => {
                                const itemKey = key(item);
                                let fragment: DocumentFragment | undefined = fragmentCache.get(itemKey);

                                // Check if we need to create/update the fragment
                                const needsUpdate =
                                    !fragment ||
                                    (compare &&
                                        previousValues.has(itemKey) &&
                                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                        compare(previousValues.get(itemKey)!, item));

                                if (needsUpdate) {
                                    // Generate new fragment
                                    const result = run(item, index, arr);
                                    fragment = DOM.getHydratedFragment(result) ?? undefined;
                                    if (fragment) {
                                        fragmentCache.set(itemKey, fragment);
                                        previousValues.set(itemKey, item);
                                    }
                                }

                                // Insert the fragment
                                if (fragment) {
                                    const nodes = DOM.insertFragment(root, fragment);
                                    currentNodes.push(...nodes);
                                }
                            });

                            // Clean up unused keys
                            const currentKeys = new Set(items.map((item) => key(item)));
                            for (const cachedKey of fragmentCache.keys()) {
                                if (!currentKeys.has(cachedKey)) {
                                    fragmentCache.delete(cachedKey);
                                    previousValues.delete(cachedKey);
                                }
                            }
                        };

                        // Initial render
                        updateDOM(initial);

                        // Subscribe to changes if itt is subscribable
                        if (isSubscribable(itt)) {
                            itt.subscribe((items) => {
                                queueMicrotask(() => updateDOM(items));
                            });
                        }
                    };

                    return Object.assign(struct, {
                        [Symbols.STRUCT]: Symbols.STRUCT,
                    });
                },
            };
        },
    };
};
