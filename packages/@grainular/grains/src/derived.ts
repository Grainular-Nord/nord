/** @format */

import type { Grain, Subscriber } from './grain';

export const derived = <V, R>(source: Grain<V>, run: (value: V) => R): Grain<R> => {
    return Object.assign(() => run(source()), {
        subscribe(subscriber: Subscriber<R>) {
            return source.subscribe((value) => {
                subscriber(run(value));
            });
        },
    });
};
