/** @format */

import { ComponentProps } from './component-props';
import { Directive } from './directive';
import { TemplateDirective } from './template-directive';

export type NordInit = {
    target: Element | null;
    props?: ComponentProps;
    directives?: (Directive | TemplateDirective)[];
};
