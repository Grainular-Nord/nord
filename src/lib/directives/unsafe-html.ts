/** @format */

import { Directive } from '../../types';
import { createDirective } from './create-directive';

/**
 * Create a directive that allows inserting raw HTML content into the DOM. Caution: This directive can expose your
 * application to security vulnerabilities if used improperly. It should only be used with trusted content.
 *
 * @param {string} html - The raw HTML content to be inserted into the DOM.
 * @returns {Directive<Text>} A directive function that inserts the raw HTML content into the DOM as child nodes of a container.
 *
 * @example
 * // Creating a component that uses the unsafeHtml directive to insert raw HTML content
 * import { createComponent, render, unsafeHtml } from "@nord/core";
 *
 * const App = createComponent((html) => {
 *   return html`<div>Hello ${unsafeHtml("<img src='x' onerror='alert(1)'>")}</div>`;
 * });
 *
 * render(App, { target: document.querySelector("#app") });
 *
 * // Caution: Only use unsafeHtml with trusted content, as it can pose a security risk if used with untrusted content.
 */
export const unsafeHtml = (html: string): Directive<Text> => {
    return createDirective(
        (node: Text) => {
            const anchor = document.createElement('div');
            node.replaceWith(anchor);
            anchor.innerHTML = html;
        },
        { nodeType: 'Text' }
    );
};
