/** @format */

import { Context } from './context';
import { DirectiveHandler } from './directive-handler';
export { ElementDirective } from './element-directive';
export { Subscriber } from './subscriber';
export { Updater } from './updater';
export { Grain } from './grain';
export { ComparisonFunc } from './comparison-func';
export { ReadonlyGrain } from './readonly-grain';
export { ComponentProps } from './component-props';
export { NordInit } from './nord-init';
export { Component } from './component';
export { ComponentTemplate } from './component-template';
export { TemplateDirective } from './template-directive';
// The global component registry
declare global {
    interface Window {
        $$nord: {
            context: Context<any>;
            directives: Map<string, DirectiveHandler<Element> | DirectiveHandler<Text>>;
        };
    }
}
