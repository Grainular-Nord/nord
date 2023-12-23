/** @format */

import { ComparisonFunc, Subscriber, Updater, Grain } from '../../types';
import { øInjectGrainMetaData } from './inject-grain-metadata';

export const grain = <V = unknown>(value: V, comparisonFunc?: ComparisonFunc<V>): Grain<V> => {
    let _val: V = value;
    const compareForEquality = comparisonFunc ?? ((prev: V, curr: V) => prev !== curr);
    const _grain = () => _val;

    // inject meta data
    øInjectGrainMetaData(_grain);

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

    _grain.set = set;
    _grain.subscribe = subscribe;
    _grain.update = update;

    return _grain;
};
