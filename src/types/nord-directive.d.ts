/** @format */

import { DirectiveHandler } from './directive-handler';

/**
 * NørdDirective encompasses both element and template directives, allowing for custom
 * behavior or transformations to be applied to DOM elements or text nodes.
 *
 * This type is a union of two record types:
 * 1. Record<`@${string}`, DirectiveHandler<Element>>: Represents element directives.
 *    - Key: A string prefixed with '@', identifying the name of the element directive.
 *    - Value: A DirectiveHandler function that defines the behavior for an Element node.
 *
 * 2. Record<`&${string}`, DirectiveHandler<Text>>: Represents template directives.
 *    - Key: A string prefixed with '&', identifying the name of the template directive.
 *    - Value: A DirectiveHandler function that defines the behavior for a Text node.
 *
 * @example
 * // Example of an element directive within NørdDirective
 * const clickDirective: NørdDirective = {
 *   '@click': (element, handler) => {
 *     element.addEventListener('click', handler);
 *   }
 * };
 *
 * // Example of a template directive within NørdDirective
 * const ifDirective: NørdDirective = {
 *   '&if': (textNode, condition) => {
 *     // Logic to conditionally display the textNode
 *   }
 * };
 *
 * // These directives can be used in component templates to apply custom behaviors
 * // to elements or to conditionally manipulate text nodes.
 */

export type NørdDirective =
    | Record<`@${string}`, DirectiveHandler<Element>>
    | Record<`&${string}`, DirectiveHandler<Text>>;
