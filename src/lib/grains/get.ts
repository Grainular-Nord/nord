/** @format */

import { ReadonlyGrain } from '../../types';
import { derived } from './derived';

/**
 * Creates a special grain that reactively derives a property from a source object grain.
 *
 * @template T - The type of the source object.
 * @template P - The type of the property key in the source object.
 *
 * @param {ReadonlyGrain<T>} grain - The source object grain from which the property will be derived.
 * @param {P} property - The property key to derive from the source object.
 *
 * @returns {ReadonlyGrain<T[P]>} A special grain that represents the derived property.
 *
 * @example
 * // Creating a special grain to derive the 'name' property from an object grain 'user'
 * const user = grain({ name: 'John', age: 30 });
 * const userName = get(user, 'name'); // Creates a grain representing the 'name' property
 * console.log(userName()); // Outputs: 'John'
 */

export const get = <T extends Record<PropertyKey, unknown>, P extends keyof T>(
    grain: ReadonlyGrain<T>,
    property: P
): ReadonlyGrain<T[P]> => {
    return derived(grain, (value) => value[property]);
};
