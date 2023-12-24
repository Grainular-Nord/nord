/** @format */

import { ComponentProps } from './component-props';
import { Directive } from './directive';

export type NordInit = {
    target: Element | null;
    props?: ComponentProps;
    directives?: Directive[];
};
