/** @format */

import { Grain, ReadonlyGrain, Subscriber } from '../../types';
import { isGrain } from '../../utils/is-grain';
import { øInjectGrainMetaData } from './inject-grain-metadata';

/**
 * Converts a regular Grain into a ReadonlyGrain.
 * This function allows you to create a read-only version of an existing Grain,
 * which can be used to expose a grain's value for reading and subscribing, without allowing direct modifications.
 *
 * @template V - The type of value held by the Grain and the resulting ReadonlyGrain.
 *
 * @param {Grain<V>} grain - The Grain to be converted into a ReadonlyGrain.
 * @returns {ReadonlyGrain<V>} A ReadonlyGrain that mirrors the original Grain's value
 * but does not allow modifications through `set` or `update` methods.
 *
 * @throws {TypeError} Throws an error if the provided argument is not a Grain.
 *
 * @example
 * // Example of creating a ReadonlyGrain from a regular Grain
 * const counter$ = grain(0); // Create a Grain
 * const counterReadonly$ = readonly(counter$); // Create a ReadonlyGrain from the Grain
 *
 * // The ReadonlyGrain can be subscribed to, but not directly modified
 * counterReadonly$.subscribe(value => console.log(`Readonly count: ${value}`));
 */

export const readonly = <V>(grain: Grain<V>): ReadonlyGrain<V> => {
    if (!isGrain(grain)) {
        throw new Error('[Nørd:Grain]: Value is not a Grain');
    }

    const _grain = () => grain();
    _grain.subscribe = (subscriber: Subscriber<V>, seed = true) => {
        return grain.subscribe(subscriber, seed);
    };

    // Inject Metadata
    øInjectGrainMetaData(_grain);

    return _grain as ReadonlyGrain<V>;
};
