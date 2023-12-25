/** @format */

import { ReadonlyGrain } from './readonly-grain';
import { ElementDirective } from './element-directive';
import { TemplateDirective } from './template-directive';
import { ToStringTypes } from './to-string-types';
import { DirectiveHandler } from './directive-handler';
import { NørdDirective } from './nord-directive';
import { ComponentProps } from './component-props';

export type HtmlParserFunc = (
    strings: TemplateStringsArray,
    ...params: (ReadonlyGrain<any> | NørdDirective | ToStringTypes | NodeList | ComponentProps)[]
) => NodeList;
