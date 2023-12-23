/** @format */

export { Subscriber } from './subscriber';
export { Updater } from './updater';
export { Grain } from './grain';
export { ComparisonFunc } from './comparison-func';
export { ReadonlyGrain } from './readonly-grain';

// The global component registry
declare global {
    interface Window {
        $$nord: {
            components: Map<Selector<string>, Component>;
        };
    }
}
