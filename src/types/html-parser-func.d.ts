/** @format */

import { ReadonlyGrain } from './readonly-grain';
import { ToStringTypes } from './to-string-types';
import { ComponentProps } from './component-props';
import { Directive } from './directive';

/**
 * Represents a function that parses an HTML template literal and returns a NodeList representing the resulting DOM structure.
 *
 * @param {TemplateStringsArray} strings - An array of template string literals.
 * @param {...(ReadonlyGrain<any> | Directive<NodeType> | ToStringTypes | NodeList)} params - Parameters to be
 *     interpolated into the template string. These can include reactive grains, directives, primitive values, or NodeList.
 *
 * @returns {NodeList} A NodeList representing the DOM structure generated from the template literal and parameters.
 */

export type HtmlParserFunc = (
    strings: TemplateStringsArray,
    ...params: (ReadonlyGrain<any> | Directive | ToStringTypes | NodeList)[]
) => NodeList;
