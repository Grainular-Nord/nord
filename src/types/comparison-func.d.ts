/** @format */

/**
 * This function is used to determine if the value of a grain has changed,
 * which in turn triggers updates to subscribers.
 *
 * @template V - The type of values that will be compared by the function.
 *
 * @param {V} prev - The previous value of the grain.
 * @param {V} curr - The current value of the grain.
 * @returns {boolean} Returns `true` if the current value is considered different
 * from the previous value, triggering updates to subscribers. Otherwise, returns `false`.
 *
 * @example
 * // Example of a custom comparison function that checks for deep equality
 * const deepEqualityComparison = (prev, curr) => JSON.stringify(prev) !== JSON.stringify(curr);
 * const myGrain$ = grain(myObject, deepEqualityComparison);
 */

export type ComparisonFunc<V> = (prev: V, curr: V) => boolean;
