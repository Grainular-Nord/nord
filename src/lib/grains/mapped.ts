/** @format */

import { ReadonlyGrain } from '../../types';
import { GrainValue } from '../../types/grain-value';
import { combined } from './combined';

/**
 * Maps an array of ReadonlyGrain instances and creates a new ReadonlyGrain containing an array of values extracted
 * from the input grains. The order of types in the input array is preserved in the resulting array.
 *
 * @template Dependencies - Tuple of ReadonlyGrain types for the input grains.
 *
 * @param {Dependencies} grains - An array of ReadonlyGrain instances to be mapped.
 *
 * @returns {ReadonlyGrain<GrainValue<Dependencies>>}
 *   A ReadonlyGrain containing an array of values extracted from the input grains with preserved type order.
 *
 * @example
 * import { mapped, grain } from "@grainular/nord";
 *
 * const result = mapped([grain(1), grain('2')]);
 * // Returns ReadonlyGrain<[1, '2']>
 */

export type MappedFn = {
    <Deps extends [ReadonlyGrain<any>, ...ReadonlyGrain<any>[]]>(grains: Deps): ReadonlyGrain<GrainValue<Deps>>;
    <Deps extends ReadonlyGrain<any>[]>(grains: Deps): ReadonlyGrain<GrainValue<Deps>>;
    <Deps extends readonly ReadonlyGrain<any>[]>(grains: Deps): ReadonlyGrain<GrainValue<Deps>>;
};

/**
 * Maps an array of ReadonlyGrain instances and creates a new ReadonlyGrain containing an array of values extracted
 * from the input grains. The order of types in the input array is preserved in the resulting array.
 *
 * @template Dependencies - Tuple of ReadonlyGrain types for the input grains.
 *
 * @param {Dependencies} grains - An array of ReadonlyGrain instances to be mapped.
 *
 * @returns {ReadonlyGrain<GrainValue<Dependencies>>}
 *   A ReadonlyGrain containing an array of values extracted from the input grains with preserved type order.
 *
 * @example
 * import { mapped, grain } from "@grainular/nord";
 *
 * const result = mapped([grain(1), grain('2')]);
 * // Returns ReadonlyGrain<[1, '2']>
 */
export const mapped: MappedFn = <Dependencies extends ReadonlyGrain<any>[]>(
    grains: Dependencies
): ReadonlyGrain<GrainValue<Dependencies>> => {
    return combined(grains, (values) => values);
};
