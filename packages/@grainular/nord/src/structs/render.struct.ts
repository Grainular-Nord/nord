import type { Fragment } from '../internals/fragment';
import type { Subscribable } from '../application/subscribable';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createStruct } from './create-struct';

/**
 * `$render` is a struct that renders a `Fragment` held by a
 * `Subscribable`, replacing the current nodes whenever the fragment changes.
 *
 * ```ts
 * const view = grain(html`<p>Hello</p>`);
 *
 * html`${$render(view)}`;
 * ```
 *
 * When the subscribable emits a new fragment, the previous nodes are
 * disconnected and replaced with the newly rendered ones. All nodes are
 * cleaned up when the struct is unmounted.
 */

/**
 * Creates a struct that reactively renders a `Fragment` from a
 * subscribable source.
 *
 * @param {Subscribable<Fragment>} source - A subscribable whose
 * value is the `Fragment` to render. The rendered output is updated
 * whenever the source emits a new fragment.
 *
 * @returns {Fragment} A struct fragment that renders and tracks the current
 * fragment from the source.
 *
 * @example
 * ```ts
 * const view = grain(html`<p>Initial</p>`);
 *
 * html`${$render(view)}`;
 *
 * view.set(html`<p>Updated</p>`);
 * ```
 */
export const $render = (source: Subscribable<Fragment>) => {
    return createStruct(
        (node, lifecycle) => {
            let nodes: Node[] = [];

            const render = (maybeFragment: (() => Fragment) | Fragment) => {
                lifecycle.disconnectNodes(nodes);

                const fragment = typeof maybeFragment === 'function' ? maybeFragment() : maybeFragment;
                nodes = hydrateFragment(fragment, lifecycle);

                node.before(...nodes);
            };

            render(source());
            const ondestroy = source.subscribe(render);

            return () => {
                ondestroy?.();
                lifecycle.disconnectNodes(nodes);
                nodes = [];
            };
        },
        () => {
            return source().render();
        },
    );
};
