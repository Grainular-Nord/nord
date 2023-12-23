/** @format */

export { Subscriber } from './subscriber';
export { Updater } from './updater';
export { Grain } from './grain';
export { ComparisonFunc } from './comparison-func';
export { ReadonlyGrain } from './readonly-grain';
export { ComponentProps } from './component-props';
export { Component } from './component';
export { NordInit } from './nord-init';

// The global component registry
declare global {
    interface Window {
        $$nord: {
            components: Map<Selector<string>, Component>;
        };
    }
}
