/** @format */

import type { Grain } from './grain';

/**
 * Wraps a (Writable) Grain and exposes it as a readonly variant.
 * Can be called directly to retrieve the value, but no update is
 * possible through the returned value. A grain in its fundamental
 * signature represents a `subscribable`.
 *
 * @template V - The type of value the grain will hold,
 *  inferred from the source grain.
 * @param { Grain<V> } source - The grain to shadow.
 * @returns { Grain<V> } - A readonly Grain<V>
 */
export const readonly = <V>(source: Grain<V>): Grain<V> => {
    return Object.assign(() => source(), {
        subscribe: source.subscribe,
    });
};
