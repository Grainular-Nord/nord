/** @format */

import { ElementDirective } from '../../types';
import { DirectiveHandler } from '../../types/directive-handler';

/**
 * Creates a new ElementDirective with the specified name and directive handler.
 * This function is designed to streamline the definition of custom element directives,
 * which are used to extend or modify the behavior of DOM elements within component templates.
 *
 * @param {`@${string}`} name - The name of the element directive, prefixed with an at-sign (`@`).
 *   This naming convention helps in easily identifying element directives within the framework.
 * @param {DirectiveHandler<Element>} directive - The handler function for the directive.
 *   This function should define the behavior or transformation that the directive applies to Element nodes.
 *
 * @returns {ElementDirective} An object conforming to the ElementDirective type,
 *   containing the name and the directive handler function.
 *
 * @example
 * // Example of creating an ElementDirective using createElementDirective
 * const clickHandler = createElementDirective('@click', (element) => {
 *   // Logic to handle click events on the element
 *   element.addEventListener('click', () => {
 *     console.log('Element clicked!');
 *   });
 * });
 *
 * // This created directive can then be used in component templates to attach
 * // custom click event behavior to elements.
 */

export const createElementDirective = (name: `@${string}`, directive: DirectiveHandler<Element>): ElementDirective => {
    return {
        name,
        directive,
    };
};
