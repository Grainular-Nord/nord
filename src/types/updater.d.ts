/** @format */
/**
 * An updater function is a higher-order function used to modify the current value of a grain.
 * It takes the current value of the grain as an argument and returns the new value,
 * which will be used to update the grain if it passes the comparison check.
 *
 * @template V - The type of value the updater function will receive and return.
 *
 * @param {V} value - The current value of the grain.
 * @returns {V} The updated value for the grain.
 *
 * @example
 * // Example of an updater function
 * const increment = currentValue => currentValue + 1;
 * const counter$ = grain(0); // Using the '$' sign to denote a reactive grain
 * counter$.update(increment); // Increments the value of $counter
 */

export type Updater<V> = (value: V) => V;
