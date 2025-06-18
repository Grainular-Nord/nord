import type { Subscribable, TemplateResult } from '../component/template-parser';
import { isSubscribable } from '../internals/is-subscribable';
import { memoizeNodes } from '../internals/memoize-nodes';
import { createStruct } from './create-struct';

type NodeEntry<T> = {
    index: number;
    key: string | number;
    snapshot: [T, number, T[]];
    node: Element;
};

export const $each = <T>(
    itr: (() => Array<T>) & Partial<Subscribable<Array<T>>>,
    compare?: (prev: T, current: T) => boolean,
) => {
    return {
        $withKey: (keyFn: (entry: T) => string | number) => {
            return {
                $as: (run: (entry: T, index: number, arr: Array<T>) => TemplateResult) => {
                    return createStruct((anchor: Comment) => {
                        // The each Struct is our most complex struct. In contrast to
                        // the main render method of Nord and the other structs, we do have
                        // changing data and templates that need to be diffed and dynamically
                        // inserted and moved to allow for reactivity.

                        const createNodeMap = (itt: T[]) => {
                            return new Map<string | number, NodeEntry<T>>(
                                itt.map((value, idx, arr) => {
                                    const key = keyFn(value);
                                    const [node] = memoizeNodes(run(value, idx, arr));
                                    return [key, { key, snapshot: [value, idx, arr], node: node, index: idx }];
                                }),
                            );
                        };

                        // The struct closes over all data necessary to diff and render the list
                        // - itr is a function or subscribable that returns the itr<T>. We always
                        //      operate on this array, either as singular static render or reactive
                        //      list.
                        // - compare is a optional fn to compare the previous and current entries to decide if
                        //      the template should be rerendered. By default, we avoid rerendering, however
                        //      this can be useful if you want deep reactivity not driven by reactive primitives
                        // - keyFn is what uniquely identifies the nodes we're inserting. Diffing happens
                        //      based on the order of keys tracked
                        // - run is the actual function that turns T into a TemplateResult. The run fn
                        //      is used to create a new or changed node (if the compare fn is used).
                        //      Otherwise, we avoid rerendering nodes, and therefore, will only render new nodes.
                        // - anchor is the structs anchor comment, serving as baseline for the termination
                        //      of the list.

                        // We create the initial nodemap tracking the entries and
                        const nodeMap = createNodeMap(itr());

                        // We then append the nodes before setting up any reactive subscription.
                        // This allows to very efficiently insert the first static nodes
                        for (const node of nodeMap.values().map(({ node }) => node)) {
                            anchor.parentElement?.insertBefore(node, anchor);
                        }

                        if (isSubscribable(itr)) {
                            return itr.subscribe((next) => {
                                // As we're tracking a subscribable here, we need to change
                                // the rendering mechanism.
                                // - For each value in next, we want to create a new NodeEntry object, so that
                                //      we can compare them by key and value. As insert order into maps is stable
                                //      this allows us to also check for the correct location. We can compare the
                                //      correct order via the key of the node entry.
                                // - We then operate beginning from the first node (first entry in our nodeMap) until
                                //      we reach the anchor comment, marking the end of our list.
                                // - Equal keys & equal value means no operation needs to be performed
                                // - Equal keys & unequal value means, the node is replaced
                                // - Not equal keys means, the node with the correct key from the last list should be inserted
                                //      if no last list key exists, the new key is inserted.

                                const nextNodes = createNodeMap(next);
                                const existingKeys = new Set(nodeMap.keys());
                                const orderedNodes = new Map<string | number, NodeEntry<T>>();
                                // Iterate the nodes and replace or ignore accordingly
                                for (const { key, snapshot, index, node } of nextNodes.values()) {
                                    const currentNode = nodeMap.get(key);

                                    if (currentNode && currentNode.key === key) {
                                        orderedNodes.set(key, currentNode);
                                        // If the currentNode's key and the next node's key is equal,
                                        // we run the compare fn and ignore or replace accordingly.
                                        if (compare && !compare(currentNode.snapshot[0], snapshot[0])) {
                                            // Replace the node, otherwise we do nothing
                                            currentNode.node.replaceWith(node);
                                            orderedNodes.set(key, { key, snapshot, index, node });
                                        }
                                    }

                                    if (currentNode && currentNode.key !== key && nodeMap.has(key)) {
                                        // If the current node is a existing node, but misplaced,
                                        // it needs to be moved to the correct position. If the
                                        // compare fn is provided, we also check if we need to
                                        // replace nodes
                                        if (currentNode.node.nextSibling !== anchor) {
                                            anchor.parentElement?.insertBefore(currentNode.node, anchor);
                                            orderedNodes.set(key, { ...currentNode, index });
                                        }

                                        if (compare && !compare(currentNode.snapshot[0], snapshot[0])) {
                                            // Replace the node, otherwise we do nothing
                                            currentNode.node.replaceWith(node);
                                            orderedNodes.set(key, { key, snapshot, index, node });
                                        }
                                    }

                                    if (!existingKeys.has(key)) {
                                        // If the nodemap doesn't have our key, we want to create
                                        // and track the element.
                                        anchor.parentElement?.insertBefore(node, anchor);
                                        orderedNodes.set(key, { key, index, node, snapshot });
                                    }
                                }

                                // We then want to remove all entries that are in nodeMap, but not in nextMap
                                // and want to make sure the elements are removed correctly, to allow
                                // for our lifecycle methods to run.
                                for (const key of nodeMap.keys()) {
                                    if (!nextNodes.has(key)) {
                                        nodeMap.get(key)?.node.remove();
                                        nodeMap.delete(key);
                                    }
                                }

                                nodeMap.clear();
                                for (const [key, entry] of orderedNodes.entries()) {
                                    nodeMap.set(key, entry);
                                }
                            });
                        }
                    });
                },
            };
        },
    };
};
