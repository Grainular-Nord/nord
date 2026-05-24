import type { Fragment } from '../internals/fragment';
import { createDirective } from './create-directive';
/**
 * A directive that attaches an event listener to a DOM element. The listener
 * is automatically removed when the element is unmounted.
 *
 * ```ts
 * html`<button ${on('click', () => console.log('clicked'))}>Click me</button>`;
 * ```
 *
 * Supports all events in `HTMLElementEventMap`, with full type inference on
 * the event argument.
 */

/**
 * Creates a directive that binds an event listener to the target element.
 *
 * @template Key - A key of `HTMLElementEventMap`, inferred from `event`.
 *
 * @param {Key} event - The event name to listen for (e.g. `'click'`, `'input'`).
 * @param {(event: HTMLElementEventMap[Key]) => void} listener - The callback
 * invoked when the event fires.
 * @param {AddEventListenerOptions} [options] - Optional options passed to
 * `addEventListener`.
 *
 * @returns {Fragment} A directive fragment attachable to elements in a template.
 *
 * @example
 * ```ts
 * const handler = (event: MouseEvent) => console.log(event.clientX);
 *
 * html`<button ${on('click', handler)}>Click me</button>`;
 * ```
 */
export const on = <Key extends keyof HTMLElementEventMap>(
    event: Key,
    listener: (event: HTMLElementEventMap[Key]) => void,
    options?: AddEventListenerOptions,
): Fragment => {
    const handler = (ev: Event) => listener(ev as HTMLElementEventMap[Key]);
    return createDirective((node: Element) => {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    });
};
