/** @format */

import { DirectiveHandler } from '../../types/directive-handler';
import { TemplateDirective } from '../../types/template-directive';

/**
 * Creates a new TemplateDirective with the specified name and directive handler.
 * This function simplifies the process of defining custom template directives,
 * which are used to manipulate or augment the rendering behavior of text within templates.
 *
 * @param {`&${string}`} name - The name of the template directive, prefixed with an ampersand (`&`).
 *   This naming convention is used to easily identify template directives within the framework.
 * @param {DirectiveHandler<Text>} directive - The handler function for the directive.
 *   This function should define the behavior or transformation that the directive applies to Text nodes.
 *
 * @returns {TemplateDirective} An object conforming to the TemplateDirective type,
 *   containing the name and the directive handler function.
 *
 * @example
 * // Example of creating a TemplateDirective using createTemplateDirective
 * const myTextFormatter = createTemplateDirective('&formatText', (textNode) => {
 *   // Logic to format or manipulate the textNode
 * });
 *
 * // This created directive can then be used in component templates to apply
 * // the specified logic to Text nodes.
 */

export const createTemplateDirective = (name: `&${string}`, directive: DirectiveHandler<Text>): TemplateDirective => {
    return {
        name,
        directive,
    };
};
