import { disconnectNodes } from '../application/lifecycle-observer';
import type { ComponentFragment } from '../component/component-fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createStruct } from './create-struct';

/**
 * Struct to render async data and elements
 *
 * @param source
 */
export const $await = <T>(source: Promise<T>) => {
    return {
        $then: (template: (value: T) => ComponentFragment) => {
            let initialNodes: Element[] = [];
            let resolveErrorNodes: ((error: Error) => Element[]) | null = null;

            const struct = createStruct((root: Comment) => {
                root.before(...initialNodes);
                source
                    .then((result) => {
                        // Make sure the node is still connected
                        if (!root.isConnected) return;

                        const nodes = hydrateFragment(template(result));
                        disconnectNodes(initialNodes);
                        root.before(...nodes);
                    })
                    .catch((error) => {
                        if (!root.isConnected) return;
                        // Disconnect the current nodes
                        // regardless if new nodes exist
                        disconnectNodes(initialNodes);

                        // Create the new error state nodes,
                        // or clear the nodes entirely
                        if (resolveErrorNodes) {
                            const nodes = resolveErrorNodes(error);
                            root.before(...nodes);
                            return;
                        }

                        initialNodes = [];
                    });
            });

            const startNodes = (template: () => ComponentFragment) => {
                initialNodes = hydrateFragment(template());
                return Object.assign(struct, {
                    $catch: errorNodes,
                });
            };

            const errorNodes = (template: (error: Error) => ComponentFragment) => {
                resolveErrorNodes = (error: Error) => hydrateFragment(template(error));
                return Object.assign(struct, {
                    $pending: startNodes,
                });
            };

            return Object.assign(struct, {
                $pending: startNodes,
                $catch: errorNodes,
            });
        },
    };
};
