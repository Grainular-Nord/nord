import { disconnectNodes } from '../application/lifecycle-observer';
import type { Subscribable } from '../application/subscribable';
import type { ComponentFragment } from '../component/component-fragment';
import type { Fragment } from '../internals/fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import { createStruct } from './create-struct';

/**
 * `$if` is a struct for conditionally rendering content based on a boolean
 * value or `Subscribable<boolean>`. When the condition changes, the current
 * nodes are disconnected and replaced with the appropriate template.
 *
 * ```ts
 * const isLoggedIn = grain(false);
 *
 * html`${$if(isLoggedIn)
 *     .$then(() => html`<p>Welcome back</p>`)
 *     .$else(() => html`<p>Please log in</p>`)
 * }`;
 * ```
 *
 * If the source is a plain getter rather than a `Subscribable`, the condition
 * is evaluated once on hydration and never updated.
 */

type IfThenStruct = {
    /**
     * Specifies the template to render when the condition is `false`.
     * If omitted, nothing is rendered for the false state.
     *
     * @param {() => ComponentFragment} show - A function returning the
     * template to render when the condition is false.
     *
     * @returns {Fragment} A struct fragment that renders either the `$then`
     * or `$else` template depending on the current condition.
     */
    $else: (show: () => ComponentFragment) => Fragment;
};

type IfStruct = {
    /**
     * Specifies the template to render when the condition is `true`.
     * Can be chained with `.$else` to specify a fallback for the false state.
     *
     * @param {() => ComponentFragment} fulfilled - A function returning the
     * template to render when the condition is true.
     *
     * @returns {IfThenStruct & Fragment} A struct fragment, chainable with `.$else`.
     */
    $then: (fulfilled: () => ComponentFragment) => IfThenStruct & Fragment;
};

/**
 * Creates a struct that conditionally renders a template based on a boolean condition.
 *
 * @param {Subscribable<boolean> | (() => boolean)} conditional - A subscribable
 * or getter that provides the boolean condition. If subscribable, the rendered
 * content updates reactively whenever the value changes.
 *
 * @returns {IfStruct} An object with a `$then` method to specify the template
 * to render when the condition is true. Can be chained with `.$else` to specify
 * a fallback for the false state.
 *
 * @example
 * ```ts
 * // Reactive condition with else branch
 * const isLoggedIn = grain(false);
 *
 * html`${$if(isLoggedIn)
 *     .$then(() => html`<p>Welcome back</p>`)
 *     .$else(() => html`<p>Please log in</p>`)
 * }`;
 * ```
 *
 * @example
 * ```ts
 * // Without else — renders nothing when false
 * const isAdmin = grain(false);
 *
 * html`${$if(isAdmin).$then(() => html`<button>Delete</button>`)}`;
 * ```
 */
export const $if = (conditional: Subscribable<boolean> | (() => boolean)): IfStruct => {
    const nodes = new Map<boolean, () => Element[]>();

    const struct = (fulfilled: () => ComponentFragment) => {
        nodes.set(true, () => hydrateFragment(fulfilled()));
        const initial = conditional();

        return (root: Comment) => {
            const currentNodes = nodes.get(initial);
            let evaluated = currentNodes?.() ?? [];
            root.before(...evaluated);

            if (isSubscribableValue(conditional)) {
                return conditional.subscribe((value) => {
                    disconnectNodes(evaluated);
                    evaluated = nodes.get(value)?.() ?? [];
                    root.before(...evaluated);
                });
            }
        };
    };

    return {
        $then: (fulfilled: () => ComponentFragment) => {
            const snapshot = () => (conditional() ? fulfilled().render() : '');
            const structFn = struct(fulfilled);

            return Object.assign(createStruct(structFn, snapshot), {
                $else: (show: () => ComponentFragment) => {
                    nodes.set(false, () => hydrateFragment(show()));
                    return createStruct(structFn, () => (!conditional() ? show().render() : fulfilled().render()));
                },
            });
        },
    };
};
