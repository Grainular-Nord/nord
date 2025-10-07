/** @format */

// INTERNAL USE ONLY
const defaultCompareFn = <V = unknown>(current: V, next: V) => current === next;

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

export type WritableGrain<V> = Grain<V> & {
    set: (next: V) => void;
    update: (run: (current: V) => V) => void;
};

export const grain = <V = unknown>(start: V, isEqual = defaultCompareFn): WritableGrain<V> => {
    let _value = start;
    const consumers = new Set<Subscriber<V>>();

    const notifyConsumers = () => {
        for (const consumer of Array.from(consumers)) consumer(_value);
    };

    const set = (newValue: V) => {
        if (!isEqual(_value, newValue)) {
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
