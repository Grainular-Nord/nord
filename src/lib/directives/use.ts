/** @format */

import { Directive } from '../../types';
import { createDirective } from './create-directive';

/**
 * Creates a directive that applies custom logic to a DOM element in a component template.
 * This function is useful for attaching arbitrary behavior or effects to elements.
 *
 * @param {(element: Element) => void} handler - A function that defines the custom behavior or effect.
 *   This function is called with the element as its argument, allowing direct manipulation or enhancement
 *   of the element.
 *
 * @returns {Directive} An object representing the created element directive, which can be used
 *   within component templates to apply the specified handler to an element.
 *
 * @example
 * // Example of creating a custom directive using Use
 * const applyCustomBehavior = Use((element) => {
 *   // Custom logic to modify or interact with the element
 *   element.style.backgroundColor = 'lightblue';
 * });
 *
 * // The returned directive can be used in component templates to apply custom behavior.
 * // e.g., <div ${applyCustomBehavior}></div>
 */

export const use = (handler: (element: Element) => void): Directive<Element> => {
    return createDirective(handler, { nodeType: 'Element' });
};
