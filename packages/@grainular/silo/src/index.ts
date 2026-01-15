import type { Grain } from '@grainular/grains';

/**
 * Represents a reactive store with synchronous access, subscriptions,
 * and derived selectors.
 *
 * A Silo is a callable function that returns the current state.
 * It exposes:
 * - `subscribe` to react to all state updates.
 * - `select` to create derived grains that emit only when the selected value changes.
 *
 * Updates to the store are done via methods defined inside the store
 * which call the internal `set` function. The state is otherwise readonly from outside.
 * To read the current state, directly read the store state or any selector of the store.
 *
 * To correctly type the store, you explicitly need to define an interface or type and pass
 * it to the silo function. There is no inference, to make sure the store implements
 * the previously defined contract.
 */
export type Silo<T extends Record<PropertyKey, unknown>> = {
    /** Retrieve the current state synchronously. */
    (): T;

    /**
     * Subscribe to all state changes.
     * @param subscriber Called with the latest state whenever it changes.
     * @returns Cleanup function to unsubscribe.
     */
    subscribe(subscriber: (state: T) => void): () => void;

    /**
     * Create a derived reactive grain based on a selector function.
     * Only emits when the selected value changes (compared by `Object.is`).
     * @param selector Function selecting a portion of the state.
     * @returns A Grain representing the derived value.
     */
    select<V>(selector: (state: T) => V): Grain<V>;
};

/**
 * Creates a new Silo store.
 *
 * @param init Function that returns the initial state object.
 * Receives a `set` method for updating the store. Methods on the store
 * can internally call `set` to mutate the state.
 *
 * The returned store:
 * - Can be called directly to retrieve the current state.
 * - Provides `subscribe` for reacting to state changes.
 * - Provides `select` for creating derived grains.
 *
 * To correctly type the store, define an interface or type and pass it to `silo`.
 * There is no automatic inference, so the store fully implements the provided contract.
 *
 * @example
 * ```ts
 * type CounterStore = {
 *   count: number;
 *   increment: () => void;
 * }
 *
 * const counterStore = silo<CounterStore>((set) => ({
 *   count: 0,
 *   increment: () => set({ count: counterStore().count + 1 }),
 * }));
 *
 * // Reading state directly
 * console.log(counterStore().count);
 *
 * // Subscribing to changes
 * counterStore.subscribe(state => console.log(state.count));
 *
 * // Using a derived selector
 * const count = counterStore.select(state => state.count);
 * count.subscribe(value => console.log(value));
 * ```
 *
 * @returns A Silo instance with `subscribe` and `select`.
 */
export const silo = <T extends Record<PropertyKey, unknown>>(
    init: (set: (partial: Partial<T>) => void) => T,
): Silo<T> => {
    // Set up subscribers and subscriber tracking
    const subscribers = new Set<(state: T) => void>();
    const notifyConsumers = (state: T) => {
        for (const listener of subscribers) {
            listener(state);
        }
    };

    // Method to subscribe to the store
    // and receive state updates
    const subscribe = (subscriber: (state: T) => void) => {
        subscribers.add(subscriber);
        return () => {
            subscribers.delete(subscriber);
        };
    };

    // A selector creates a derived value that emits to it's
    // subscribers only when the derived value changes.
    // We still run the selector fn every time the source changes
    // as we really can't figure out if the selected property
    // changes any other way.
    const select = <V>(selector: (state: T) => V): Grain<V> => {
        const subscribe = (subscriber: (value: V) => void) => {
            let current: V = selector(state);
            const selectorFn = (state: T) => {
                // Evaluate the next state snapshot, and if
                // the values have changed, notify the selector
                // subscriber
                const next = selector(state);
                if (Object.is(current, next)) return;
                subscriber(next);
                current = next;
            };
            subscribers.add(selectorFn);
            return () => {
                subscribers.delete(selectorFn);
            };
        };

        return Object.assign(() => selector(state), { subscribe });
    };

    // Declare the initial state that
    // we will later set values on
    let state: T;
    const set = (partial: Partial<T>) => {
        state = Object.assign({}, state ?? {}, partial);
        notifyConsumers(state);
    };

    // Retrieve the initial state of the store;
    state = init(set);

    return Object.assign(() => state, { subscribe, select });
};
