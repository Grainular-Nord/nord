/** @format */

export { Context } from './context';
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

// The global component registry
declare global {
    interface Window {
        $$nord: {
            context: Context<any>;
        };
    }
}
