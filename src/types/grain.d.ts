/** @format */

import { Subscriber } from './subscriber';
import { Updater } from './updater';

export type Grain<V> = {
    (): V;
    set: (value: V) => void;
    update: (updater: Updater<V>) => void;
    subscribe: (subscriber: Subscriber<V>, seed?: boolean) => () => void;
};
