/** @format */

import { Grain, ReadonlyGrain, Subscriber } from '../types';

export const readonly = <V>(grain: Grain<V>): ReadonlyGrain<V> => {
    const _grain = () => grain();

    _grain.subscribe = (subscriber: Subscriber<V>, seed = false) => {
        return grain.subscribe(subscriber, seed);
    };

    return _grain;
};
