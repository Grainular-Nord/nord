import { lifecycleObserver } from '../application/lifecycle-observer';
import type { Fragment } from '../internals/fragment';
import { createDirective } from './create-directive';

/**
 * A directive that runs a callback when the target element is mounted into the DOM.
 * If the callback returns a function, it is registered as a cleanup callback and
 * called when the element is removed.
 *
 * ```ts
 * const logMount = mounted((node) => {
 *     console.log('mounted', node);
 *     return () => console.log('unmounted', node);
 * });
 *
 * html`<div ${logMount}>Hello</div>`;
 * ```
 */

/**
 * Creates a directive that runs a callback when the target element is mounted.
 *
 * @param {(element: Element) => void | (() => void)} run - A function called
 * with the target element on mount. May return a cleanup function that runs
 * when the element is removed from the DOM.
 *
 * @returns {Fragment} A directive fragment attachable to elements in a template.
 *
 * @example
 * ```ts
 * html`<div ${mounted((node) => console.log('mounted', node))}>Hello</div>`;
 * ```
 */
export const mounted = (run: (element: Element) => void | (() => void)): Fragment => {
    return createDirective((node: Element) => {
        lifecycleObserver.trackMount(node, () => run(node));
    });
};
