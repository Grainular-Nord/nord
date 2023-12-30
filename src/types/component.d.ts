/** @format */

import { ComponentProps } from './component-props';
import { CssParserFunc } from './css-parser-func';
import { HtmlParserFunc } from './html-parser-func';
/**
 * This type represents the structure of functions that define components.
 * Components should always be created by the `createComponent` function.
 *
 * @template Props - The type of properties that the component will accept. These properties should extend ComponentProps,
 *                   allowing for a flexible structure with various possible property names and types.
 *
 * @param {Props} props - The properties passed to the component. These are defined by the specific implementation
 *                        of the component and should adhere to the structure of ComponentProps.
 * @param {NodeList} [children] - An optional NodeList representing the child nodes of the component.
 *                                This allows for the inclusion of children elements or components within the component.
 *
 * @returns {NodeList} The function should return a NodeList representing the rendered output of the component.
 *                     This output is what will be inserted into the DOM when the component is rendered.
 *
 * Usage Example:
 * ```
 * // Define a new component
 * const Greeting = createComponent((html) => {
 *     return html`<p>Hello, World!</p>`;
 * });
 *
 * // Create an App component using Greeting
 * const App = createComponent((html) => {
 *     return html`${Greeting({})}`;
 * });
 *
 * // Set styles for the Greeting component
 * Greeting.setStyle((parser) => {
 *     parser`p { color: red; }`;
 * });
 * ```
 */
export type Component<Props extends ComponentProps> = {
    /**
     * Function that defines the behavior and rendering of the component.
     *
     * @param {Props} props - Object containing the properties for the component.
     * @param { (parser: HtmlParserFunc) =>  NodeList} [children] - Template function to get NodeList of child elements/components.
     * @returns {NodeList} - NodeList representing the rendered component.
     */
    (props: Props, children?: (parser: HtmlParserFunc) => NodeList): NodeList;

    /**
     * A boolean flag to identify if the object is a component.
     */
    readonly isComponent: true;

    /**
     * A method to apply CSS styles to the component.
     *
     * @param {function} style - A function that accepts a parser function to define CSS styles.
     *                           The parser function should be used as a tagged template literal.
     *
     * Usage Example:
     * ```
     * // Set styles for the Greeting component
     * Greeting.setStyle(css => css`
     *     p { color: red; }
     * `);
     * ```
     */
    readonly setStyle: (style: (parser: CssParserFunc) => void) => void;
};
