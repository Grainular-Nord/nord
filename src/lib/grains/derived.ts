/** @format */

import { ReadonlyGrain } from '../../types';
import { grain } from './grain';
import { readonly } from './readonly';

/**
 * Creates a new derived ReadonlyGrain from an existing grain by applying a transformation function.
 * This function allows you to create a new reactive state based on the value of another grain,
 * with the derived grain's value being a transformation of the original grain's value.
 *
 * @template T - The type of value held by the original ReadonlyGrain.
 * @template R - The type of value held by the derived ReadonlyGrain.
 *
 * @param {ReadonlyGrain<T>} value - The original ReadonlyGrain from which to derive the new grain.
 * @param {(value: T) => R} run - A transformation function to apply to the original grain's value.
 * It receives the original grain's value and returns the transformed value.
 *
 * @returns {[ReadonlyGrain<R>, () => void]} A tuple containing the derived ReadonlyGrain and a
 * function to unsubscribe the derived grain from the original grain's changes.
 *
 * @example
 * // Example of creating a derived ReadonlyGrain
 * const number$ = grain(5); // Create a Grain with the value 5
 * const [isEven$, destroy] = derived(number$, n => n % 2 === 0); // Create a derived ReadonlyGrain
 *
 * // The derived grain reflects whether the original grain's value is even
 * isEven$.subscribe(isEven => console.log(`Is number even? ${isEven}`));
 * number$.set(3); // Logs: Is number even? false
 * number$.set(4); // Logs: Is number even? true
 */

export const derived = <T, R = T>(value: ReadonlyGrain<T>, run: (value: T) => R): [ReadonlyGrain<R>, () => void] => {
    const _grain = grain<R>(run(value()));
    const unsubscribe = value.subscribe((v) => _grain.set(run(v)));
    return [readonly(_grain), () => unsubscribe()];
};
