import { disconnectNodes } from '../application/lifecycle-observer';
import type { ComponentFragment } from '../component/component-fragment';
import type { Fragment } from '../internals/fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createStruct } from './create-struct';

/**
 * `$try` is a struct for rendering a component fragment with a guaranteed
 * error boundary. If the render function throws, the fallback provided via
 * `.$catch` is rendered instead. Both the render and fallback are also
 * evaluated during SSR.
 *
 * ```ts
 * html`${$try(() => html`${riskyComponent()}`)
 *     .$catch((err) => html`<p>Something went wrong: ${err}</p>`)
 * }`;
 * ```
 *
 * Unlike `$await`, `$try` is fully synchronous — it catches errors thrown
 * during the initial render only, not errors that occur after hydration.
 */

type TryStruct = {
    /**
     * Specifies the fallback template rendered if the render function throws.
     * Terminates the chain and returns the struct fragment.
     *
     * @param {(error: unknown) => ComponentFragment} fallback - A function
     * receiving the thrown error and returning the fallback template.
     *
     * @returns {Fragment} A struct fragment that renders the main template
     * or the fallback if an error is thrown.
     */
    $catch: (fallback: (error: unknown) => ComponentFragment) => Fragment;
};

/**
 * Creates a struct that renders a template inside an error boundary, falling
 * back to a provided template if the render throws.
 *
 * @param {() => ComponentFragment} render - A function returning the template
 * to attempt to render.
 *
 * @returns {TryStruct} An object with a `.$catch` method to specify the
 * fallback template rendered if `render` throws.
 *
 * @example
 * ```ts
 * html`${$try(() => html`${riskyComponent()}`)
 *     .$catch((err) => html`<p>Something went wrong: ${err}</p>`)
 * }`;
 * ```
 */
export const $try = (render: () => ComponentFragment): TryStruct => {
    return {
        $catch: (fallback: (error: unknown) => ComponentFragment) => {
            return createStruct(
                (node) => {
                    let nodes: Element[] = [];

                    try {
                        nodes = hydrateFragment(render());
                    } catch (e: unknown) {
                        nodes = hydrateFragment(fallback(e));
                    } finally {
                        node.replaceWith(...nodes);
                    }

                    return () => {
                        disconnectNodes(nodes);
                        nodes = [];
                    };
                },
                () => {
                    try {
                        return render().render();
                    } catch (e) {
                        return fallback(e).render();
                    }
                },
            );
        },
    };
};
