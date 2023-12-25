/** @format */

import { Subscriber } from './subscriber';

/**
 * A ReadonlyGrain is a read-only variant of a regular grain. It allows reading its value and
 * subscribing to changes, but does not permit direct modification of its value.
 * ReadonlyGrains are typically created using the `readonly()`, `derived()` or `combined()` functions.
 *
 * @template V - The type of value held by the ReadonlyGrain.
 *
 * @property {Function} (): V - A function to get the current value of the ReadonlyGrain.
 * @property {Function} subscribe - A method to subscribe to changes in the grain's value.
 *   When the value changes, the subscribed functions are called with the new value.
 *
 * @param {Subscriber<V>} subscriber - The subscriber function that will be called with the new value.
 * @param {boolean} [seed=false] - If true, the subscriber is immediately called with the current value upon subscription.
 * @returns {Function} A function to unsubscribe the passed subscriber from the grain.
 *
 * @example
 * // Example of creating and using a ReadonlyGrain
 * const counter$ = grain(0); // Create a regular grain
 * const counterReadonly$ = readonly($counter); // Make the grain readonly
 *
 * // Subscribing to the ReadonlyGrain
 * const unsubscribe = counterReadonly$.subscribe((value) => console.log({value}));
 * // ...later
 * unsubscribe(); // Unsubscribes the logging function
 */

export type ReadonlyGrain<V> = {
    (): V;
    subscribe: (subscriber: Subscriber<V>, seed?: boolean) => () => void;
};
