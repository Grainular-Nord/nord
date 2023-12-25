/** @format */

import { DirectiveHandler } from './directive-handler';
import { Component } from './component';
import { Selector } from './selector';
export { ElementDirective } from './element-directive';
export { Subscriber } from './subscriber';
export { Updater } from './updater';
export { Grain } from './grain';
export { ComparisonFunc } from './comparison-func';
export { ReadonlyGrain } from './readonly-grain';
export { ComponentProps } from './component-props';
export { NordInit } from './nord-init';
export { Component };
export { ComponentInit } from './component-init';
export { TemplateDirective } from './template-directive';
// The global component registry
declare global {
    interface Window {
        $$nord: {
            components: Map<string, Component>;
            directives: Map<string, DirectiveHandler<Element> | DirectiveHandler<Text>>;
        };
    }
}
