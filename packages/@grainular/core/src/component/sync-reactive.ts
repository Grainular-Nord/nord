export const syncReactive = <T>({
    get,
    subscribe,
}: {
    get: () => T;
    subscribe: (subscriber: (value: T) => void) => void;
}) => {
    const value = () => get();
    const subscribers = new Set<(value: T) => void>();

    subscribe(() => {
        for (const subscriber of subscribers) {
            subscriber(value());
        }
    });

    return Object.assign(value, {
        subscribe: (subscriber: (value: T) => void) => {
            subscribers.add(subscriber);
            return () => subscribers.delete(subscriber);
        },
    });
};
