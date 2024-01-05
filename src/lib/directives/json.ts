/** @format */

import { Directive } from '../../types';
import { createDirective } from './create-directive';

/**
 * A directive that sets the text content of an element to a JSON representation of the provided value.
 *
 * This directive takes a JavaScript value, converts it to a JSON string, and sets it as the text content
 * of the target element. If there is an error during the JSON stringification process, it displays
 * "[Error during JSON parse]" as the element's text content.
 *
 * @param {any} value - The JavaScript value to be represented as JSON.
 *
 * @returns {Directive} A directive that applies the JSON representation to the target element's text content.
 *
 * @example
 * // Import necessary modules
 * import { createComponent,json } from '@grainular/nord';
 *
 * // Create a Grain component
 * const App = createComponent((html) => {
 *     // Define a JavaScript object
 *     const data = { name: 'John', age: 30 };
 *
 *     // Apply the JSON directive to display the JSON representation of the object
 *     return html`<div>${json(data)}</div>`;
 * });
 */
export const json = (value: any): Directive<Text> => {
    return createDirective(
        (element: Text) => {
            try {
                element.nodeValue = JSON.stringify(value);
            } catch (e) {
                element.nodeValue = `[Error during JSON parse]`;
            }
        },
        { nodeType: 'Text' }
    );
};
