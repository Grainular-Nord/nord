/** @format */

import { Subscriber } from './subscriber';

export type ReadonlyGrain<V> = {
    (): V;
    subscribe: (subscriber: Subscriber<V>, seed?: boolean) => () => void;
};
