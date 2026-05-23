/** @format */

import type { Grain, Subscriber } from './grain';

/**
 * A `derived` grain transforms the value of a source grain through a mapping
 * function, producing a new readonly grain of a potentially different type.
 * Like all grains, the value is read by calling it:
 *
 * ```ts
 * const count = grain(5);
 * const isEven = derived(count, n => n % 2 === 0);
 * const value = isEven(); // false
 * ```
 *
 * Reads are always synchronous — the mapping function is applied on the fly.
 * Subscribers are notified whenever the source grain changes.
 */

/**
 * Creates a readonly grain derived from a source grain by applying a
 * transformation function to its value.
 *
 * @template V - The type of value held by the source grain.
 * @template R - The type of value produced by the transformation.
 *
 * @param {Grain<V>} source - The grain to derive from.
 * @param {(value: V) => R} run - A transformation applied to the source value.
 *
 * @returns {Grain<R>} A readonly grain whose value is the result of applying
 * `run` to the current value of `source`. Subscribers are notified whenever
 * the source grain changes.
 *
 * @example
 * ```ts
 * const count = grain(5);
 * const isEven = derived(count, n => n % 2 === 0);
 *
 * isEven.subscribe(value => console.log(`Is even: ${value}`));
 * count.set(3); // Logs: Is even: false
 * count.set(4); // Logs: Is even: true
 * ```
 */
export const derived = <V, R>(source: Grain<V>, run: (value: V) => R): Grain<R> => {
    return Object.assign(() => run(source()), {
        subscribe(subscriber: Subscriber<R>) {
            return source.subscribe((value) => {
                subscriber(run(value));
            });
        },
    });
};
