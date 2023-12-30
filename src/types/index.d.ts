/** @format */

import { Context } from './context';
export { Context };
export { Subscriber } from './subscriber';
export { Updater } from './updater';
export { Grain } from './grain';
export { ComparisonFunc } from './comparison-func';
export { ReadonlyGrain } from './readonly-grain';
export { ComponentProps } from './component-props';
export { NordInit } from './nord-init';
export { Component } from './component';
export { ComponentTemplate } from './component-template';
export { Directive } from './directive';

// The global interfaces that are amended
declare global {
    interface Element {
        attributeMap: Map<string, string[]> | undefined;
    }
}
