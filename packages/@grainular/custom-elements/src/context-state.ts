type AttributeState<T extends Lowercase<string>> = Record<T, string | null>;

export class ContextState<T extends Lowercase<string>> {
    private state = {} as AttributeState<T>;
    private subscribers = new Set<(state: AttributeState<T>) => void>();
    constructor(keys: T[]) {
        for (const key of keys) this.state[key] = null;
    }

    subscribe(subscriber: (state: AttributeState<T>) => void) {
        this.subscribers.add(subscriber);
        subscriber(this.state);

        return () => {
            this.subscribers.delete(subscriber);
        };
    }
    set(partial: Partial<AttributeState<T>>) {
        this.update((state) => ({ ...state, ...partial }));
    }

    update(updater: (state: AttributeState<T>) => AttributeState<T>) {
        this.state = updater(this.state);
        for (const subscriber of this.subscribers) {
            subscriber(this.state);
        }
    }

    get() {
        return this.state;
    }

    clear() {
        this.subscribers.clear();
    }
}
