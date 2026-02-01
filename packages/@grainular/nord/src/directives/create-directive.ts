import { lifecycleObserver } from '../application/lifecycle-observer';
import type { Fragment } from '../internals/fragment';
import { createIdentifier } from '../internals/identifier';

/**
 * Creates a custom directive that can be attached to an element.
 *
 * Directives run a handler when the element is hydrated. The handler can
 * optionally return a cleanup function that runs when the element is removed
 * from the DOM.
 *
 * Example:
 * ```ts
 * import { html, mount, createDirective } from "@grainular/nord";
 *
 * const color = (color: string) =>
 *   createDirective((node) => {
 *     node.style.backgroundColor = color;
 *   });
 *
 * const App = () => html`
 *   <div ${color('red')}>I'm a red div</div>
 *   <div ${color('blue')}>I'm a blue div</div>
 * `;
 *
 * mount(App, { to: document.querySelector('main#app') });
 * ```
 *
 * @param handler - Function called with the element when it is hydrated.
 *                  Can optionally return a cleanup function for unmounting.
 * @param id - Optional unique identifier for the directive. Auto-generated if not provided.
 * @returns A `Fragment` representing the directive, which can be attached to elements.
 */
export const createDirective = (handler: (node: Element) => void | (() => void)): Fragment => {
    let _id = '';
    return {
        get id() {
            return _id;
        },
        set id(idx: string) {
            _id = createIdentifier(idx);
        },
        resolve: () => _id,
        render: () => '',
        hydrate: (node: Node) => {
            if (node instanceof Element) {
                const onDestroy = handler(node);
                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
