import { type Grain, combined, derived, grain, readonly } from '@grainular/grains';

/**
 * Represents the lifecycle state of a resource.
 *
 * - `idle`    — no request in flight, data (if any) is considered valid
 * - `pending` — a request is currently running
 * - `error`   — the last request failed
 */
type ResourceState = 'idle' | 'pending' | 'error';

/**
 * A reactive, abortable async resource.
 *
 * A resource exposes its state exclusively through {@link Grain}s and provides
 * a small set of imperative methods to control its lifecycle.
 *
 * The `data` grain is guaranteed to be valid when `state === 'idle'`.
 */
type Resource<T> = {
    /** The current lifecycle state of the resource. */
    state: Grain<ResourceState>;

    /** Derived grain that is `true` when the resource is idle. */
    idle: Grain<boolean>;

    /** Derived grain that is `true` while a request is in flight. */
    pending: Grain<boolean>;

    /** Holds the last error produced by the resource, if any. */
    error: Grain<Error | null>;

    /**
     * Holds the current resource data.
     *
     * The value is only meaningful when `state === 'idle'`.
     */
    data: Grain<T>;

    /**
     * Triggers a refresh of the resource.
     *
     * Any currently running request will be aborted before
     * starting a new one.
     */
    refresh: () => void;

    /**
     * Aborts the currently running request, if any.
     *
     * Does not change the current data value.
     */
    abort: () => void;

    /**
     * Imperatively updates the resource data.
     *
     * This does not affect the resource state and does not
     * trigger a fetch.
     */
    mutate: (next: T) => void;

    /**
     * Destroys the resource.
     *
     * Unsubscribes from all dependencies and aborts any
     * in-flight request.
     */
    destroy: () => void;
};

/**
 * Async initializer function used by a resource.
 *
 * Receives an {@link AbortSignal} that should be passed to any
 * abortable async operation (e.g. `fetch`).
 */
type StateInitializer<T> = (state: { abortSignal: AbortSignal }) => Promise<T>;

/**
 * Creates a reactive async resource.
 *
 * The resource automatically refreshes when any of the provided
 * dependency grains change.
 *
 * @param fetcher Async initializer responsible for producing the resource data.
 * @param deps Optional dependency grains that trigger a refresh when changed.
 */
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
