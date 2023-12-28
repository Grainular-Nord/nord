/** @format */

import { ToStringTypes } from './to-string-types';

/**
 * Represents a function type used for parsing CSS styles.
 * This function is designed to be used as a tagged template literal, allowing for dynamic insertion of values into CSS strings.
 *
 * @param {TemplateStringsArray} strings - An array of string literals. In a tagged template, this corresponds to the static parts of the template.
 * @param {...ToStringTypes[]} values - A rest parameter representing the dynamic values to be interpolated into the template.
 *                                       These values are inserted into the CSS string at positions corresponding to their order in the template.
 *
 * Usage Example:
 * ```
 * // Example of a CssParserFunc
 * const cssParser: CssParserFunc = (strings, ...values) => {
 *     const style = strings.reduce((result, str, i) => result + str + (values[i] || ''), '');
 *     console.log(style); // Outputs the combined CSS string
 * };
 *
 * // Using cssParser as a tagged template literal
 * cssParser`
 *     body { background-color: ${'lightblue'}; }
 *     p { color: ${'navy'}; }
 * `;
 * ```
 * In this example, 'lightblue' and 'navy' are dynamically inserted into the CSS string.
 */
export type CssParserFunc = (strings: TemplateStringsArray, ...values: ToStringTypes[]) => void;
