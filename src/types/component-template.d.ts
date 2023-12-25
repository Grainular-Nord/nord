/** @format */

import { ComponentProps } from './component-props';
import { HtmlParserFunc } from './html-parser-func';
import { Selector } from './selector';
import { TypedProps } from './typed-props';

/**
 * This type specifies the structure of the object used to initialize a new component using `createComponent`.
 *
 * @template Props - The type of properties that the component will accept, extending from ComponentProps.
 * @template S - A string type representing the component's selector, if applicable.
 *
 * @property {Function} template - A function that defines the component's structure and behavior.
 *   This function takes an HtmlParserFunc and the component's properties as arguments. It should
 *   return a NodeList representing the component's rendered output. The HtmlParserFunc is used to
 *   parse a tagged template literal, enabling the integration of reactive grains, directives, and
 *   other dynamic content within the template.
 * @property {Selector<S>} [selector] - (Optional) A CSS selector used for registering the component
 *   in a global namespace. If provided, the selector must be a capitalized string and acts as a custom
 *   tag name for the component, enabling its usage as a custom element in HTML.
 *
 * @example
 * // Example of a ComponentInit object
 * const init: ComponentInit<MyProps, 'MyComponent'> = {
 *   template: (html, props) => html`<div>${props.someValue}</div>`,
 *   selector: 'MyComponent'
 * };
 */

export type ComponentTemplate<Props extends ComponentProps = any> = (
    parser: HtmlParserFunc,
    props: TypedProps<Props>
) => ReturnType<HtmlParserFunc>;
