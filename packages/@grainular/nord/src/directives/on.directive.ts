import type { Fragment } from '../internals/fragment';
import { createDirective } from './create-directive';

/**
 * Attaches an event listener to a DOM element as a directive.
 *
 * This directive is used to declaratively bind DOM events to elements within templates.
 * The listener will automatically be removed when the element is unmounted.
 *
 * @example
 * ```ts
 * import { on, html } from "@grainular/core";
 *
 * const clickHandler = (event: MouseEvent) => {
 *     console.log("Clicked!", event);
 * };
 *
 * const Button = () => html`
 *   <button ${on("click", clickHandler)}>Click me</button>
 * `;
 * ```
 *
 * @param event - The event name to listen for (e.g., "click", "input").
 * @param listener - The callback function to invoke when the event fires.
 * @param options - Optional options for `addEventListener`.
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
