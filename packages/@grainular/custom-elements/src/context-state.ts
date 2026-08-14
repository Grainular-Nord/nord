type AttributeState<T extends Lowercase<string>> = Record<T, string | null>;

export const createContext = <T extends Lowercase<string>>(keys: T[]) => {
    let value = Object.fromEntries(keys.map((key) => [key, null])) as AttributeState<T>;
    const subscribers = new Set<(state: AttributeState<T>) => void>();

    const update = (updater: (state: AttributeState<T>) => AttributeState<T>) => {
        // No point in checking Object.is, as we will basically always create a new object, not mutate it
        // (And mutating it would also then not trigger update, so mäh)
        value = updater(value);
        for (const subscriber of Array.from(subscribers)) subscriber(value);
    };

    const set = (partial: Partial<AttributeState<T>>) => {
        update((state) => ({ ...state, ...partial }));
    };

    return Object.assign(() => value, {
        set,
        update,
        subscribe: (subscriber: (state: AttributeState<T>) => void) => {
            subscribers.add(subscriber);
            return () => subscribers.delete(subscriber);
        },
    });
};

export type ContextState<T extends Lowercase<string>> = ReturnType<typeof createContext<T>>;
