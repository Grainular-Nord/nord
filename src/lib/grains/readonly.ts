/** @format */

import { Grain, ReadonlyGrain, Subscriber } from '../../types';
import { Error } from '../../utils';
import { isGrain } from '../../utils/is-grain';
import { øInjectGrainMetaData } from './inject-grain-metadata';

export const readonly = <V>(grain: Grain<V>): ReadonlyGrain<V> => {
    if (!isGrain(grain)) {
        throw new TypeError(Error.NOT_A_GRAIN);
    }

    const _grain = () => grain();
    _grain.subscribe = (subscriber: Subscriber<V>, seed = false) => {
        return grain.subscribe(subscriber, seed);
    };

    // Inject Metadata
    øInjectGrainMetaData(_grain);

    return _grain;
};
