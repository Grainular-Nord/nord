/** @format */

import { DirectiveHandler } from './directive-handler';

/**
 * Template directives are custom extensions that can modify or enhance the behavior of templates
 * within components. They are identified by a specific name and are associated with a directive handler function.
 *
 * @property {`&${string}`} name - The name of the directive, prefixed with an ampersand (`&`).
 *   This unique naming convention helps in identifying directives within templates.
 * @property {DirectiveHandler<Text>} directive - The handler function for the directive.
 *   This function defines the behavior or transformation that the directive applies to the Text node it is attached to.
 *
 * A TemplateDirective is used to manipulate or augment the rendering behavior of text within templates,
 * providing a way to introduce custom logic or features into the framework's templating system.
 *
 * @example
 * // Example of a TemplateDirective
 * const myDirective: TemplateDirective = {
 *   name: '&myDirective',
 *   directive: (textNode) => {
 *     // Directive logic that manipulates the textNode
 *   }
 * };
 *
 * // This directive can be used in component templates to apply the specified logic to Text nodes.
 */

export type TemplateDirective = {
    name: `&${string}`;
    directive: DirectiveHandler<Text>;
};
