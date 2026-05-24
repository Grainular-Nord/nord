/**
 * A `syncReactive` wraps any external reactive source — anything that exposes
 * a `get` and `subscribe` interface — into a `Grain`-compatible readable.
 * This allows non-grain reactive primitives to be used anywhere a `Grain` is expected.
 *
 * Like all grains, the value is read by calling it:
 *
 * ```ts
 * const count = syncReactive({
 *     get: () => store.count,
 *     subscribe: (notify) => store.subscribe(notify),
 * });
 *
 * count(); // current value of store.count
 * ```
 *
 * Subscription to the source is lazy — the source is only subscribed to when
 * the first subscriber is added, and unsubscribed from when the last subscriber
 * is removed. This avoids unnecessary listeners on unused reactives.
 */

import type { Subscribable } from './subscribable';

type SyncableReactive<T> = {
    get: () => T;
    subscribe: (notify: () => void) => () => void;
};

/**
 * Wraps an external reactive source into a grain-compatible readable.
 *
 * @template T - The type of value the source holds.
 *
 * @param {SyncableReactive<T>} source - The reactive source to wrap.
 * @param {() => T} source.get - A function that synchronously returns the current value.
 * @param {(notify: () => void) => () => void} source.subscribe - A function that subscribes
 * to changes in the source. Receives a notify callback and must return a teardown function.
 *
 * @returns {Subscribable<T>} A readonly grain backed by the external source. Subscribes to the
 * source lazily and cleans up when all subscribers are removed.
 *
 * @example
 * ```ts
 * const count = syncReactive({
 *     get: () => store.count,
 *     subscribe: (notify) => store.subscribe(notify),
 * });
 *
 * count.subscribe(value => console.log(value));
 * ```
 */
export const syncReactive = <T>({ get, subscribe }: SyncableReactive<T>): Subscribable<T> => {
    const value = () => get();
    const subscribers = new Set<(value: T) => void>();

    // Store the unsubscribe of the original
    // subscribe fn;
    let unsubscribe: (() => void) | null = null;

    const onUpdate = () => {
        for (const subscriber of subscribers) subscriber(value());
    };

    return Object.assign(value, {
        subscribe: (subscriber: (value: T) => void) => {
            subscribers.add(subscriber);

            if (subscribers.size === 1) {
                unsubscribe = subscribe(onUpdate);
            }

            return () => {
                subscribers.delete(subscriber);

                // if no subscribers left, unsubscribe from the source
                if (subscribers.size === 0 && unsubscribe) {
                    unsubscribe?.();
                    unsubscribe = null;
                }
            };
        },
    });
};
