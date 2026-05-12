import type { Grain, Subscriber } from './grain';

export const flattened = <T>(nested: Grain<Grain<T>>): Grain<T> => {
    // Synchronous reads are always perfectly up-to-date
    const read = () => nested()();

    return Object.assign(read, {
        subscribe: (subscriber: Subscriber<T>) => {
            // Track the inner subscription
            let innerUnsubscribe = nested().subscribe(subscriber);

            // Track the outer subscription
            const outerUnsubscribe = nested.subscribe((newInnerGrain) => {
                innerUnsubscribe(); // Clean up the old inner subscription
                innerUnsubscribe = newInnerGrain.subscribe(subscriber);
                subscriber(newInnerGrain()); // Emit the new value immediately
            });

            // Clean up both when the DOM unmounts
            return () => {
                innerUnsubscribe();
                outerUnsubscribe();
            };
        },
    });
};
