/** @format */

import { ComparisonFunc, Grain, Subscriber, Updater } from '../../types';

/**
 * Creates a reactive grain, the primary building block in the framework.
 * A grain represents a piece of reactive state that can be subscribed to and updated.
 *
 * @template V - The type of value the grain will hold.
 *
 * @param {V} value - The initial value of the grain.
 * @param {ComparisonFunc<V>} [comparisonFunc] - An optional function to determine
 * if the value has changed. Defaults to a strict inequality check (prev !== curr).
 *
 * @returns {Grain<V>} An object representing the grain, with methods to get the value,
 * set a new value, subscribe to changes, update the value using an updater function,
 * and unsubscribe from changes.
 *
 * The returned grain object has the following methods:
 * - `set(value: V)`: Sets a new value for the grain.
 * - `subscribe(subscriber: Subscriber<V>, seed: boolean = false)`: Subscribes to changes.
 *   The `seed` parameter, when true, immediately invokes the subscriber with the current value.
 *   Returns a function to unsubscribe the passed subscriber.
 * - `update(updater: Updater<V>)`: Updates the value using an updater function.
 *
 * @example
 * // Setting up a simple subscription and unsubscribing
 *
 * const count$ = grain(10);
 * const unsubscribe = count$.subscribe(value => console.log(value));
 * count$.set(20); // Logs: 20
 * unsubscribe(); // Unsubscribes the logging function
 *
 * @example
 * // Updating the grain based on it's current state
 *
 * const count$ = grain(0);
 * count$.subscribe(value => console.log(`Count is now: ${value}`));
 * count$.update(currentCount => currentCount + 1); // Logs: Count is now: 1
 * count$.update(currentCount => currentCount + 2); // Logs: Count is now: 3
 *
 */

export const grain = <V = unknown>(value: V, comparisonFunc?: ComparisonFunc<V>): Grain<V> => {
    let _val: V = value;
    const compareForEquality = comparisonFunc ?? ((prev: V, curr: V) => prev !== curr);
    const _grain = () => _val;

    const subscribers: Subscriber<V>[] = [];
    const notifySubscribers = () => {
        subscribers.forEach((subscriber) => subscriber(_val));
    };

    const set = (value: V) => {
        if (compareForEquality(_val, value)) {
            _val = value;
            notifySubscribers();
        }
    };

    const update = (updater: Updater<V>) => {
        set(updater(_val));
    };

    const subscribe = (subscriber: Subscriber<V>, seed: boolean = true) => {
        subscribers.push(subscriber);

        if (seed) {
            subscriber(_val);
        }

        return () => {
            const idx = subscribers.indexOf(subscriber);
            if (idx !== -1) {
                subscribers.splice(idx, 1);
            }
        };
    };

    _grain.set = set;
    _grain.subscribe = subscribe;
    _grain.update = update;

    return _grain as Grain<V>;
};
