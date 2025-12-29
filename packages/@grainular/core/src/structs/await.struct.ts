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
            let pendingFragment: () => ComponentFragment;
            let errorFragment: (error: Error) => ComponentFragment;

            const struct = createStruct(
                (root: Comment) => {
                    const initialNodes = pendingFragment ? hydrateFragment(pendingFragment()) : [];
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
                            if (errorFragment) {
                                const nodes = hydrateFragment(errorFragment(error));
                                root.before(...nodes);
                                return;
                            }
                        });
                },
                // For our SSR snapshot, we only render the Pending nodes if they
                // exist. Everything else is ignored.
                () => {
                    return pendingFragment()?.render() ?? '';
                },
            );

            const startNodes = (template: () => ComponentFragment) => {
                pendingFragment = template;
                return Object.assign(struct, {
                    $catch: errorNodes,
                });
            };

            const errorNodes = (template: (error: Error) => ComponentFragment) => {
                errorFragment = (error: Error) => template(error);
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
