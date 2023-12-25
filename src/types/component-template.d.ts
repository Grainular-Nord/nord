/** @format */

import { ComponentProps } from './component-props';
import { HtmlParserFunc } from './html-parser-func';
import { TypedProps } from './typed-props';

/**
 * Represents a function that defines the structure and behavior of a component.
 * This function takes a parser function (HtmlParserFunc) and the component's properties as arguments.
 * The parser function processes a tagged template literal, allowing the integration of reactive grains
 * and directives within the template, and returns a NodeList representing the DOM structure of the component.
 *
 * @template Props - The type of properties that the component will accept. Must extend ComponentProps.
 *
 * @param {HtmlParserFunc} parser - A function for processing tagged template literals to create a NodeList.
 * @param {TypedProps<Props>} props - The properties passed to the component.
 *
 * @returns {ReturnType<HtmlParserFunc>} The resulting NodeList representing the component's DOM structure.
 *
 * @example
 * // Example of a component template function
 * const myComponentTemplate = (html, { text }) => {
 *     return html`
 *         <div>
 *             <p>${text}</p>
 *         </div>
 *     `;
 * };
 */

export type ComponentTemplate<Props extends ComponentProps = {}, Ctx extends Record<PropertyKey, unknown> = {}> = (
    parser: HtmlParserFunc,
    props: TypedProps<Props, Ctx>
) => ReturnType<HtmlParserFunc>;
