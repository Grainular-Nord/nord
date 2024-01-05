/** @format */

import { ReadonlyGrain } from '../../types';
import { GrainValue } from '../../types/grain-value';
import { grain } from './grain';
import { readonly } from './readonly';

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
export const mapped = <Dependencies extends [ReadonlyGrain<any>, ...ReadonlyGrain<any>[]]>(
    grains: Dependencies
): ReadonlyGrain<GrainValue<Dependencies>> => {
    const _grain = grain(grains.map((grain) => grain()));
    grains.forEach((grain, index) =>
        grain.subscribe((value) => {
            _grain.update((curr) => {
                // process and update a new array to be returned as value
                const updatedArr = [...curr];
                updatedArr.splice(index, 1, value);
                return updatedArr;
            });
        })
    );

    return readonly(_grain) as ReadonlyGrain<GrainValue<Dependencies>>;
};
