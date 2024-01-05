/** @format */

import { ReadonlyGrain } from '../../types';
import { grain } from './grain';
import { readonly } from './readonly';

/**
 * Merges a deeply nested ReadonlyGrain and creates a new single-level ReadonlyGrain
 * containing the values from the innermost grain. The innermost grain's values will be forwarded
 * to the merged grain.
 *
 * @template T - The type of values in the innermost grain.
 *
 * @param {ReadonlyGrain<ReadonlyGrain<T>>} deepGrain - The deeply nested ReadonlyGrain to be merged.
 *
 * @returns {ReadonlyGrain<T>} A single-level ReadonlyGrain containing the values from the innermost grain.
 *
 * @example
 * import { merged, grain, ReadonlyGrain } from "@grainular/nord";
 *
 * const innerGrain = grain(42);
 * const deepGrain = grain(innerGrain);
 *
 * const result = merged(deepGrain);
 * // Returns ReadonlyGrain<42>
 */

export const merged = <T>(deepGrain: ReadonlyGrain<ReadonlyGrain<T>>): ReadonlyGrain<T> => {
    const _grain = grain<T>(deepGrain()());
    let unsubscribe: (() => void) | null = null;

    // Subscribe to the outer deep grain
    deepGrain.subscribe((innerGrain) => {
        if (unsubscribe) {
            unsubscribe();
        }

        // Subscribe to the inner grain
        unsubscribe = innerGrain.subscribe((value) => {
            // Update the merged grain with the new value
            _grain.set(value);
        });
    });

    return readonly(_grain);
};
