/** @format */

import { ReadonlyGrain } from './readonly-grain';
import { Subscriber } from './subscriber';
import { Updater } from './updater';

export type Grain<V> = ReadonlyGrain<V> & {
    set: (value: V) => void;
    update: (updater: Updater<V>) => void;
};
