/** @format */

import { ComponentProps } from './component-props';
import { Directive } from './directive';
import { TemplateDirective } from './template-directive';

export type NordInit = {
    target: Element | null;
    hydrate?: ComponentProps;
    directives?: (Directive | TemplateDirective)[];
};
