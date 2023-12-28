/** @format */

import { ReadonlyGrain, Subscriber } from '../../types';
import { GrainValue } from '../../types/grain-value';
import { grain } from './grain';
import { readonly } from './readonly';

/**
 * Creates a new ReadonlyGrain by combining multiple grains.
 * This function allows you to derive a new grain's value based on the values of several other grains.
 * The new grain's value is calculated using a provided function, which takes the current values
 * of all dependent grains as input.
 *
 * The combined grain sets up its subscriptions to the dependent grains lazily. It only subscribes
 * to them when at least one subscriber is present on the combined grain, and unsubscribes when
 * the last subscriber is removed. This behavior optimizes resource usage by avoiding unnecessary
 * updates when the combined grain is not being observed.
 *
 * @template Dependencies - An array type representing the dependent ReadonlyGrains.
 * @template R - The type of value held by the resulting derived ReadonlyGrain.
 *
 * @param {Dependencies} deps - An array of ReadonlyGrains that the new grain depends on.
 * @param {(values: GrainValue<Dependencies>) => R} fn - A transformation function that takes the current values
 * of the dependent grains and returns the new value for the derived grain.
 * @param {R} [initial] - An optional initial value for the derived grain. If not provided,
 * the initial value is calculated using the transformation function `fn`.
 *
 * @returns {ReadonlyGrain<R>} A derived ReadonlyGrain that reflects the combined state of the dependent grains.
 * The grain dynamically manages its subscriptions to dependent grains based on its own subscription state.
 *
 * @example
 * // Example of creating a combined ReadonlyGrain
 * const num1$ = grain(3);
 * const num2$ = grain(7);
 * const sum$ = combined([num1$, num2$], ([val1, val2]) => val1 + val2);
 *
 * // The combined grain reflects the sum of the values of num1$ and num2$
 * sum$.subscribe(sum => console.log(`Sum: ${sum}`)); // Logs: Sum: 10
 * num1$.set(5); // Updates sum$, logs: Sum: 12
 * num2$.set(10); // Updates sum$, logs: Sum: 15
 *
 * // When the last subscriber to sum$ is removed, sum$ unsubscribes from num1$ and num2$
 */

export const combined = <Dependencies extends [ReadonlyGrain<any>, ...ReadonlyGrain<any>[]], R>(
    deps: Dependencies,
    fn: (values: GrainValue<Dependencies>) => R,
    initial?: R
): ReadonlyGrain<R> => {
    let unsubscriberCollection: (() => void)[] = [];
    let subscribed = false;
    const subscribers: Subscriber<R>[] = [];

    const _initial = initial ?? fn(deps.map((grain) => grain()) as GrainValue<Dependencies>);
    const combined = grain(_initial);
    const subscriptionFunction = combined.subscribe;

    const subscribe = () => {
        if (subscribed) {
            return;
        }

        subscribed = true;
        unsubscriberCollection.push(
            ...deps.map((grain) =>
                grain.subscribe(() => combined.set(fn(deps.map((grain) => grain()) as GrainValue<Dependencies>)))
            )
        );
    };

    combined.subscribe = (subscriber: Subscriber<R>, seed = true) => {
        if (!subscribed) {
            subscribe();
        }

        subscribers.push(subscriber);
        const innerUnsubscribe = subscriptionFunction(subscriber, seed);

        return () => {
            innerUnsubscribe();
            const idx = subscribers.indexOf(subscriber);
            if (idx !== -1) {
                subscribers.splice(idx, 1);
            }

            // If no more subscriptions exist, destroy all subscriptions to the
            // existing dependency grains
            if (subscribers.length === 0 && unsubscriberCollection.length > 0) {
                subscribed = false;
                unsubscriberCollection.forEach((fn) => fn());
                unsubscriberCollection = [];
            }
        };
    };

    return readonly(combined);
};
