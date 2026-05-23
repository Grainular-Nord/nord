/** @format */

/**
 * A `Grain` or `WritableGrain` is a reactive primitive capturing a
 * value via closure. It is basically a getter function accessing the
 * value, with additional methods bolted on.
 *
 * A `Grain`'s value can be read by calling it. It will always return
 * a up to date value, as all values are read synchronously.
 *
 * ```ts
 * const count = grain(0);
 * const value = count(); // value = 0
 * ```
 *
 * This is a core principle of grains & nord.
 *
 * To update the value of a grain, the `set` and `update` methods
 * can be used. Any update to the value is run through the
 * compare fn to determine if subscribers should be notified.
 * If yes, the subscribers are notified in order of subscription.
 */

/**
 * Fn signature used to describe the compareFn used by grains
 * to check for equality. Receives a snapshot of the current and next
 * state. Return false to indicate that the values differ and should
 * trigger an update
 */
type CompareFn<V = unknown> = (current: V, next: V) => boolean;
const defaultCompareFn = <V = unknown>(current: V, next: V) => Object.is(current, next);

/**
 * A `subscriber` is a callback added when subscribing to a `grain`, allowing to react
 * to changes in the source `grain`s value.
 */
export type Subscriber<V = unknown> = (value: V) => void;

/**
 * Function returned by the `subscribe` method of a `grain`, allowing to
 * unsubscribe from listening to changes in the `grain`s value
 */
export type Unsubscribe = () => void;

/**
 * The readonly version of a `grain` allows to read the value synchronous as well
 * as subscribe to changes in the `grains` value.
 */
export type Grain<V = unknown> = {
    (): V;
    subscribe: (subscriber: Subscriber<V>) => Unsubscribe;
};

/**
 * The writable version of a `grain` allows to set and update the value in addition
 * to reading and subscribing. The value's are set synchronously.
 */
export type WritableGrain<V> = Grain<V> & {
    set: (next: V) => void;
    update: (run: (current: V) => V) => void;
};

/**
 * Creates a reactive writable grain.
 * A writable grain represents a piece of reactive state
 * that can be subscribed to and updated.
 *
 * @template V - The type of value the grain will hold.
 *
 * @param {V} start - The initial value of the grain.
 * @param {CompareFn<V>} [compareFunc] - An optional function to determine
 * if the value has changed. Defaults to Object.is(). To indicate change, the fn
 * should return `false`
 *
 * @returns {WritableGrain<V>} An fn representing the grain value as a getter.
 * It contains methods to set & update the value as well as subscribe to changes.
 * Grains are always synchronous, there is no batching. To retrieve the value of
 * a grain, it is called like a function.
 *
 * The returned writable grain has the following methods:
 * - `set(value: V)`: Sets a new value for the grain.
 * - `subscribe(subscriber: Subscriber<V>)`: Subscribes to changes.
 *      Returns a function to unsubscribe the passed subscriber.
 * - `update(updater: (current: V) => V)`: Updates the value using an updater function.
 *
 * @example
 * ```ts
 * // Setting up a simple subscription and unsubscribing
 * const count = grain(10);
 *
 * const unsubscribe = count.subscribe(value => console.log(value));
 * count.set(20); // Logs: 20
 * unsubscribe(); // Unsubscribes the logging function
 * ```
 *
 * @example
 * ```ts
 * // Updating the grain based on it's current state
 * const count = grain(0);
 *
 * count.subscribe(value => console.log(`Count is now: ${value}`));
 * count.update(currentCount => currentCount + 1); // Logs: Count is now: 1
 * count.update(currentCount => currentCount + 2); // Logs: Count is now: 3
 * ```
 */
export const grain = <V = unknown>(start: V, compareFunc: CompareFn<V> = defaultCompareFn): WritableGrain<V> => {
    let _value = start;
    const consumers = new Set<Subscriber<V>>();

    const notifyConsumers = () => {
        for (const consumer of Array.from(consumers)) consumer(_value);
    };

    const set = (newValue: V) => {
        if (!compareFunc(_value, newValue)) {
            _value = newValue;
            notifyConsumers();
        }
    };

    const update = (updater: (current: V) => V) => set(updater(_value));

    const subscribe = (subscriber: Subscriber<V>) => {
        consumers.add(subscriber);
        return () => consumers.delete(subscriber);
    };

    return Object.assign(() => _value, { set, update, subscribe });
};
