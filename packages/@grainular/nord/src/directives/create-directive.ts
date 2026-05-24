import { lifecycleObserver } from '../application/lifecycle-observer';
import { FRAGMENT_ID, type Fragment } from '../internals/fragment';
import { createIdentifier } from '../internals/identifier';

/**
 * A `createDirective` wraps a handler function into a `Fragment` that can be
 * attached to any element in a template. The handler runs when the element is
 * hydrated and receives the element as its argument.
 *
 * ```ts
 * const color = (color: string) =>
 *     createDirective((node) => {
 *         node.style.backgroundColor = color;
 *     });
 *
 * html`<div ${color('red')}>I'm a red div</div>`;
 * ```
 *
 * If the handler returns a function, it is registered as a cleanup callback
 * and called when the element is removed from the DOM.
 */

/**
 * Creates a directive that runs a handler when the target element is hydrated.
 *
 * @param {(node: Element) => void | (() => void)} handler - A function called
 * with the target element on hydration. May return a cleanup function that runs
 * when the element is removed from the DOM.
 *
 * @returns {Fragment} A fragment representing the directive, attachable to
 * elements in a template.
 *
 * @example
 * ```ts
 * const autofocus = createDirective((node) => {
 *     node.focus();
 * });
 *
 * html`<input ${autofocus} type="text" />`;
 * ```
 */
export const createDirective = (handler: (node: Element) => void | (() => void)): Fragment => {
    const fragmentId = createIdentifier();
    return {
        [FRAGMENT_ID]: fragmentId,
        resolve: () => fragmentId.get(),
        render: () => '',
        hydrate: (node: Node) => {
            if (node instanceof Element) {
                const onDestroy = handler(node);
                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
