export const syncReactive = <T>({
    get,
    subscribe,
}: {
    get: () => T;
    subscribe: (notify: () => void) => () => void; // Expect a teardown function
}) => {
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
