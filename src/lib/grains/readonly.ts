/** @format */

import { Grain, ReadonlyGrain, Subscriber } from '../../types';
import { assertIsGrain } from '../../utils/assert-is-grain';
import { øInjectGrainMetaData } from './inject-grain-metadata';

export const readonly = <V>(grain: Grain<V>): ReadonlyGrain<V> => {
    if (!assertIsGrain(grain)) {
        throw new TypeError(`Not a grain`);
    }

    const _grain = () => grain();
    _grain.subscribe = (subscriber: Subscriber<V>, seed = false) => {
        return grain.subscribe(subscriber, seed);
    };

    // Inject Metadata
    øInjectGrainMetaData(_grain);

    return _grain;
};
