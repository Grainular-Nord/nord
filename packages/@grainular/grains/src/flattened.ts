import type { Grain, Subscriber } from './grain';

/**
 * A `flattened` grain unwraps a grain-of-a-grain into a single grain,
 * subscribing to whichever inner grain is currently held by the outer grain.
 * Like all grains, the value is read by calling it:
 *
 * ```ts
 * const a = grain(1);
 * const b = grain(2);
 * const source = grain(a);
 * const flat = flattened(source);
 *
 * flat(); // 1
 * source.set(b);
 * flat(); // 2
 * ```
 *
 * When the outer grain changes, the subscription to the previous inner grain
 * is cleaned up and a new one is established. Both subscriptions are severed
 * when the returned unsubscribe function is called.
 */

/**
 * Flattens a grain holding another grain into a single readonly grain
 * that reflects the current inner grain's value.
 *
 * @template V - The type of value held by the inner grain.
 *
 * @param {Grain<Grain<V>>} nested - A grain whose value is itself a grain.
 *
 * @returns {Grain<V>} A readonly grain reflecting the current value of
 * whichever inner grain `nested` currently holds. Subscribers are notified
 * when either the inner grain's value changes or the outer grain switches
 * to a new inner grain.
 *
 * @example
 * ```ts
 * const a = grain(1);
 * const b = grain(2);
 * const source = grain(a);
 * const flat = flattened(source);
 *
 * flat.subscribe(value => console.log(value));
 * a.set(10);     // Logs: 10
 * source.set(b); // Logs: 2
 * b.set(20);     // Logs: 20
 * ```
 */
export const flattened = <V>(nested: Grain<Grain<V>>): Grain<V> => {
    return Object.assign(() => nested()(), {
        subscribe: (subscriber: Subscriber<V>) => {
            let innerUnsubscribe = nested().subscribe(subscriber);

            // The outer subscription updates the grain and the inner
            // subscribers and unsubscribe, basically proxying the
            // grain from nested to source
            const outerUnsubscribe = nested.subscribe((newInnerGrain) => {
                innerUnsubscribe(); // Clean up the old inner subscription
                innerUnsubscribe = newInnerGrain.subscribe(subscriber);
                subscriber(newInnerGrain()); // Emit the new value immediately
            });

            return () => {
                innerUnsubscribe();
                outerUnsubscribe();
            };
        },
    });
};
