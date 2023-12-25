/** @format */

import { ComponentProps } from './component-props';
import { ElementDirective } from './element-directive';
import { TemplateDirective } from './template-directive';

export type NordInit = {
    target: Element | null;
    hydrate?: ComponentProps;
    directives?: (ElementDirective | TemplateDirective)[];
};
