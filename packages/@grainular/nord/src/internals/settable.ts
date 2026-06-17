import type { Subscribable } from '../application/subscribable';

export type Settable<T> = Subscribable<T> & {
    set: (value: T) => void;
};

export const settable = <T>(initial: T): Settable<T> => {
    let source = initial;
    const subscribers = new Set<(value: T) => void>();
    return Object.assign(() => source, {
        subscribe: (subscriber: (value: T) => void) => {
            subscribers.add(subscriber);
            return () => subscribers.delete(subscriber);
        },
        set: (value: T) => {
            if (!Object.is(source, value)) {
                source = value;
                for (const fn of Array.from(subscribers.values())) fn(source);
            }
        },
    });
};
