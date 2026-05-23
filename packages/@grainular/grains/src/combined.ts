/** @format */

import type { Grain, Subscriber } from './grain';

/**
 * A `combined` grain derives its value from an array of source grains,
 * mapping each source to its current value. The result is a tuple typed
 * to match the exact shape of the source array.
 *
 * Like all grains, the value is read by calling it:
 *
 * ```ts
 * const a = grain(1);
 * const b = grain('hello');
 * const ab = combined([a, b]);
 * const value = ab(); // [1, 'hello']
 * ```
 *
 * Reads are always synchronous and never stale — the value is derived
 * on the fly from the current state of each source grain.
 *
 * Subscribers are notified whenever any source grain changes.
 * All source subscriptions are cleaned up when the returned unsubscribe
 * function is called.
 */

// INTERNAL USE ONLY
type GrainValue<T extends readonly Grain[]> = {
    [K in keyof T]: T[K] extends Grain<infer U> ? U : never;
};

type CombinedFn = {
    <Source extends [Grain, ...Grain[]]>(source: Source): Grain<GrainValue<Source>>;
    <Source extends Grain[]>(source: Source): Grain<GrainValue<Source>>;
    <Source extends readonly Grain[]>(source: Source): Grain<GrainValue<Source>>;
};

/**
 * Combines an array of grains into a single readonly grain whose value
 * is a tuple of each source grain's current value.
 *
 * @template Source - The tuple or array of source grains.
 *
 * @param {Source} source - The grains to combine.
 *
 * @returns {Grain<GrainValue<Source>>} A readonly grain containing a tuple
 * of the current values of all source grains. Subscribers are notified
 * whenever any source grain's value changes.
 *
 * @example
 * ```ts
 * // Combining grains and subscribing to changes
 * const count = grain(0);
 * const label = grain('hello');
 * const both = combined([count, label]);
 *
 * both.subscribe(([count, label]) => console.log(count, label));
 * count.set(1); // Logs: 1 'hello'
 * label.set('world'); // Logs: 1 'world'
 * ```
 */
export const combined: CombinedFn = <Source extends [Grain, ...Grain[]]>(source: Source) => {
    const value = () => source.map((s) => s()) as GrainValue<Source>;

    return Object.assign(value, {
        subscribe: (subscriber: Subscriber<GrainValue<Source>>) => {
            // tracking the source subscriptions to make sure that
            // we can clean up any subscription once the grain is
            // cleaned up
            const unsubscribes = source.map((source) =>
                source.subscribe(() => {
                    // If any source changes, re-evaluate and notify
                    subscriber(value());
                }),
            );

            return () => {
                for (const fn of unsubscribes) fn();
            };
        },
    });
};
