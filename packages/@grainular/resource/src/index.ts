import { type Grain, combined, derived, grain, readonly } from '@grainular/grains';

type ResourceState = 'idle' | 'pending' | 'error';
type Resource<T> = {
    // State
    state: Grain<ResourceState>;
    idle: Grain<boolean>;
    pending: Grain<boolean>;
    error: Grain<Error | null>;
    data: Grain<T>;

    // Methods
    refresh: () => void;
    abort: () => void;
    mutate: (next: T) => void;
    destroy: () => void;
};
type StateInitializer<T> = (state: { abortSignal: AbortSignal }) => Promise<T>;

export const resource = <T>(fetcher: StateInitializer<T>, deps: Array<Grain<unknown>> = []): Resource<T> => {
    const data = grain<T>(undefined as T);
    const error = grain<Error | null>(null);
    const state = grain<ResourceState>('idle');
    let abortController = new AbortController();

    // The refresh fn is the actual quiet star
    // of a resource, as it handles all the
    // running logic
    const refresh = () => {
        // Abort any current request
        // and set a new abort controller
        abortController.abort();
        abortController = new AbortController();
        const signal = abortController.signal;

        // Run the resourceFn to retrieve the data
        // of the resource and store it (or any error)
        state.set('pending');
        fetcher({ abortSignal: signal })
            .then((result) => {
                if (signal.aborted) return;

                data.set(result);
                error.set(null);
                state.set('idle');
            })
            .catch((err: unknown) => {
                if (signal.aborted) return;

                const errorCtor = err instanceof Error ? err : new Error(String(err));
                data.set(undefined as T);
                error.set(errorCtor);
                state.set('error');
            });
    };

    // We call refresh once to start
    // the initial data call and store
    refresh();

    // We also subscribe to all provided
    // dependency grains, and run the refresh
    // when once of the dependencies change
    const dependencies = combined(deps).subscribe(() => refresh());

    // Both the abort and mutate fns are basically
    // just facade function and do not hold
    // any internal complexity
    const abort = () => abortController.abort();
    const mutate = (next: T) => data.set(next);
    const destroy = () => {
        dependencies();
        abort();
    };

    // We return
    return {
        refresh,
        abort,
        mutate,
        destroy,
        state: readonly(state),
        idle: derived(state, (state) => state === 'idle'),
        pending: derived(state, (state) => state === 'pending'),
        error: readonly(error),
        data: readonly(data),
    };
};

const userId = grain('abcd');
type User = { id: string; name: string };
const user = resource<User>(
    async ({ abortSignal }) => {
        const response = await fetch(`/api/user/${userId()}`, { signal: abortSignal });
        return response.json();
    },
    [userId],
);
