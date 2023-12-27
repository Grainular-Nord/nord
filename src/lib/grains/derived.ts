/** @format */

import { Subscriber } from '../../../dist/types';
import { ReadonlyGrain } from '../../types';
import { grain } from './grain';
import { readonly } from './readonly';
/**
 * Creates a new derived ReadonlyGrain from an existing grain by applying a transformation function.
 * This function allows you to create a new reactive state based on the value of another grain,
 * with the derived grain's value being a transformation of the original grain's value.
 *
 * The derived grain dynamically manages its subscription to the original grain. It subscribes to the
 * original grain only when at least one subscriber is present on the derived grain and unsubscribes
 * when the last subscriber is removed. This behavior optimizes resource usage by avoiding unnecessary
 * updates when the derived grain is not being observed.
 *
 * @template T - The type of value held by the original ReadonlyGrain.
 * @template R - The type of value held by the derived ReadonlyGrain.
 *
 * @param {ReadonlyGrain<T>} value - The original ReadonlyGrain from which to derive the new grain.
 * @param {(value: T) => R} run - A transformation function to apply to the original grain's value.
 * It receives the original grain's value and returns the transformed value.
 *
 * @returns {ReadonlyGrain<R>} A derived ReadonlyGrain that reflects a transformed state of the original grain's value.
 * The grain dynamically manages its subscription to the original grain based on its own subscription state.
 *
 * @example
 * // Example of creating a derived ReadonlyGrain
 * const number$ = grain(5); // Create a Grain with the value 5
 * const isEven$ = derived(number$, n => n % 2 === 0); // Create a derived ReadonlyGrain
 *
 * // The derived grain reflects whether the original grain's value is even
 * isEven$.subscribe(isEven => console.log(`Is number even? ${isEven}`));
 * number$.set(3); // Logs: Is number even? false
 * number$.set(4); // Logs: Is number even? true
 *
 * // When the last subscriber to isEven$ is removed, isEven$ unsubscribes from number$
 */

export const derived = <T, R = T>(value: ReadonlyGrain<T>, run: (value: T) => R): ReadonlyGrain<R> => {
    let unsubscriber: null | (() => void) = null;
    let subscribed = false;
    const subscribers: Subscriber<R>[] = [];

    const initialValue = run(value());
    const derived = grain<R>(initialValue);
    const subscriptionFunction = derived.subscribe;

    // Function to set up the subscription to the original grain
    const subscribe = () => {
        unsubscriber = value.subscribe((value) => derived.set(run(value)));
        subscribed = true;
    };
    derived.subscribe = (subscriber: Subscriber<R>, seed = true) => {
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
            // existing dependent grain
            if (subscribers.length === 0 && unsubscriber) {
                subscribed = false;
                unsubscriber();
                unsubscriber = null;
            }
        };
    };

    return readonly(derived);
};
