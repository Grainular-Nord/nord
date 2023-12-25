/** @format */

import { DirectiveHandler } from './directive-handler';

/**
 * Element directives are custom extensions that can modify or enhance the behavior of DOM elements
 * within components. Each directive is identified by a specific name and is associated with a directive handler function.
 *
 * @property {`@${string}`} name - The name of the directive, prefixed with an at-sign (`@`).
 *   This unique naming convention helps in identifying element directives within templates.
 * @property {DirectiveHandler<Element>} directive - The handler function for the directive.
 *   This function defines the behavior or transformation that the directive applies to the Element it is attached to.
 *
 * An ElementDirective is used to manipulate or augment the behavior of DOM elements in component templates,
 * providing a way to introduce custom logic or interactive features into the framework's templating system.
 *
 * @example
 * // Example of an Simplified click directive
 * const clickDirective: ElementDirective = {
 *   name: '@click',
 *   directive: (element) => {
 *     // Directive logic that adds click event handling to the element
 *     element.addEventListener('click', () => {
 *       console.log('Element clicked!');
 *     });
 *   }
 * };
 */

export type ElementDirective = {
    name: `@${string}`;
    directive: DirectiveHandler<Element>;
};
