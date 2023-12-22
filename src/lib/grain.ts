/** @format */

import { ComparisonFunc, Subscriber, Updater, Grain } from '../types';

export const grain = <V = unknown>(value: V, comparisonFunc?: ComparisonFunc<V>): Grain<V> => {
    let _val: V = value;
    const compareForEquality = comparisonFunc ?? ((prev: V, curr: V) => prev !== curr);
    const Grain = () => _val;

    const subscribers: Subscriber<V>[] = [];
    const notifySubscribers = () => {
        subscribers.forEach((subscriber) => subscriber(_val));
    };

    const set = (value: V) => {
        if (compareForEquality(_val, value)) {
            _val = value;
            notifySubscribers();
        }
    };

    const update = (updater: Updater<V>) => {
        set(updater(_val));
    };

    const subscribe = (subscriber: Subscriber<V>, seed: boolean = false) => {
        subscribers.push(subscriber);

        if (seed) {
            subscriber(_val);
        }

        return () => {
            const idx = subscribers.indexOf(subscriber);
            if (idx !== -1) {
                subscribers.splice(idx, 1);
            }
        };
    };

    Grain.set = set;
    Grain.subscribe = subscribe;
    Grain.update = update;

    return Grain;
};
