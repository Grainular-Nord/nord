/** @format */

import { ReadonlyGrain } from './readonly-grain';
import { ElementDirective } from './element-directive';
import { TemplateDirective } from './template-directive';
import { ToStringTypes } from './to-string-types';
import { DirectiveHandler } from './directive-handler';
import { NørdDirective } from './nord-directive';
import { ComponentProps } from './component-props';

/**
 * This function is used to parse HTML templates, enabling the integration of dynamic content,
 * such as reactive grains, directives, and other types of nodes or properties.
 *
 * @param {TemplateStringsArray} strings - An array of string literals from a tagged template.
 * @param {...(ReadonlyGrain<any> | NørdDirective | ToStringTypes | NodeList)[]} params - A list of parameters
 *   that corresponds to the expressions embedded in the template literals. These can include various types such as:
 *   - `ReadonlyGrain<any>`: Reactive grains that update the content dynamically.
 *   - `NørdDirective`: Custom directives for handling specific behaviors or transformations in the template.
 *   - `ToStringTypes`: Types that can be converted to strings for rendering.
 *   - `NodeList`: A collection of nodes, which can be used to include existing DOM elements or other components.
 *   - `ComponentProps`: Properties that can be passed down to components within the template.
 *
 * @returns {NodeList} The function returns a NodeList, representing the parsed HTML structure with all dynamic content
 *   integrated and ready for rendering in the DOM.
 */

export type HtmlParserFunc = (
    strings: TemplateStringsArray,
    ...params: (ReadonlyGrain<any> | NørdDirective | ToStringTypes | NodeList)[]
) => NodeList;
