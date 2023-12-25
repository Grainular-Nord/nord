/** @format */

import { ReadonlyGrain } from './readonly-grain';
import { Subscriber } from './subscriber';
import { Updater } from './updater';

/**
 * A Grain is the fundamental reactive state unit, which extends the capabilities of a ReadonlyGrain.
 * In addition to reading the value and subscribing to changes, a Grain allows direct modification
 * of its value through `set` and `update` methods.
 *
 * @template V - The type of value held by the Grain.
 *
 * @property {Function} (): V - A function to get the current value of the Grain.
 * @property {Function} set - A method to set a new value for the Grain.
 *   When the value is set, subscribers are notified if the value passes the comparison check.
 * @property {Function} update - A method to update the value of the Grain using an updater function.
 *   This provides a way to apply complex transformations to the Grain's value.
 * @property {Function} subscribe - A method inherited from ReadonlyGrain to subscribe to changes in the Grain's value.
 *
 * @example
 * // Example of creating and using a Grain
 * const counter$ = grain(0); // Create a Grain
 *
 * // Subscribing to the Grain
 * counter$.subscribe((count) => console.log(`Current count: ${count}`));
 * counter$.set(1); // Sets the value to 1 and logs: Current count: 1
 * counter$.update(count => count + 1); // Increments the value and logs: Current count: 2
 */

export type Grain<V> = ReadonlyGrain<V> & {
    set: (value: V) => void;
    update: (updater: Updater<V>) => void;
};
