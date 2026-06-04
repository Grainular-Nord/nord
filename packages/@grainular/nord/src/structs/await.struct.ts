import { disconnectNodes } from '../application/lifecycle-observer';
import type { ComponentFragment } from '../component/component-fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createStruct } from './create-struct';

/**
 * `$await` is a struct for rendering async data in templates. It resolves a
 * `Promise` and renders the result using a template function. Optional
 * `$pending` and `$catch` states can be chained to handle loading and error
 * states respectively.
 *
 * ```ts
 * const data = fetch('/api/user').then(r => r.json());
 *
 * html`${$await(data)
 *     .$then(user => html`<p>${user.name}</p>`)
 *     .$pending(() => html`<p>Loading...</p>`)
 *     .$catch(err => html`<p>Error: ${err.message}</p>`)
 * }`;
 * ```
 *
 * If a non-Promise value is passed, it is wrapped in `Promise.resolve` and
 * resolved immediately. The `$pending` state is only rendered during SSR
 * snapshots — in the browser, resolution is near-instant for resolved values.
 *
 * Nodes are only updated if the root comment node is still connected to the
 * DOM, preventing updates on unmounted components.
 */

/**
 * Creates a struct that resolves a promise and renders the result into
 * the template.
 *
 * @template T - The type of value the promise resolves to.
 *
 * @param {Promise<T> | T} source - The promise to resolve, or a plain value
 * which is wrapped in `Promise.resolve`.
 *
 * @returns An object with a `$then` method to specify the resolved template.
 * The result of `$then` can be further chained with:
 * - `.$pending(() => ComponentFragment)` — rendered while the promise is pending.
 * - `.$catch((error: Error) => ComponentFragment)` — rendered if the promise rejects.
 *
 * @example
 * ```ts
 * const user = fetchUser(id);
 *
 * html`${$await(user)
 *     .$then(user => html`<p>${user.name}</p>`)
 *     .$pending(() => html`<p>Loading...</p>`)
 *     .$catch(err => html`<p>Failed: ${err.message}</p>`)
 * }`;
 * ```
 */
export const $await = <T>(source: Promise<T> | T) => {
    return {
        $then: (template: (value: T) => ComponentFragment) => {
            let pendingFragment: () => ComponentFragment;
            let errorFragment: (error: Error) => ComponentFragment;
            let resolvedNodes: Element[] = [];

            const struct = createStruct(
                (root: Comment) => {
                    const initialNodes = pendingFragment ? hydrateFragment(pendingFragment()) : [];
                    root.before(...initialNodes);
                    (source instanceof Promise ? source : Promise.resolve(source))
                        .then((result) => {
                            // Make sure the node is still connected
                            if (!root.isConnected) return;

                            const nodes = hydrateFragment(template(result));
                            disconnectNodes(initialNodes);
                            root.before(...nodes);
                            resolvedNodes = nodes;
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
                                resolvedNodes = nodes;
                            }
                        });

                    return () => {
                        disconnectNodes(resolvedNodes);
                    };
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
