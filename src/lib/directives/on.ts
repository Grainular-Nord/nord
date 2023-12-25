/** @format */

import { NørdDirective } from '../../types/nord-directive';

/**
 * Creates a template directive to add an event listener to an element.
 * This function simplifies the process of attaching event listeners to DOM elements within component templates.
 *
 * @param {keyof HTMLElementEventMap} event - The name of the event to listen for.
 *   It should be a valid key from the HTMLElementEventMap.
 * @param {(event: Event) => void} listener - The event listener function that will be called
 *   when the event is triggered. It receives the event object as a parameter.
 * @param {AddEventListenerOptions} [options] - Optional parameters to customize the behavior
 *   of the event listener, such as `capture`, `once`, and `passive`.
 *
 * @returns {NørdDirective} An object representing the created element directive, which can be used
 *   to attach the specified event listener to an element in a template.
 *
 * @example *
 * // The returned directive can be used in component templates to attach the click event listener.
 * // e.g., <button ${On('click', (ev) => console.log({ev}))}>Click me</button>
 */

export const On = (
    event: keyof HTMLElementEventMap,
    listener: (event: Event) => void,
    options?: AddEventListenerOptions
): NørdDirective => {
    // Return the created template directive
    const eventFunc = (element: Element) => {
        element.addEventListener(event, (ev) => listener(ev), options);
    };

    return { '@event': eventFunc };
};
