/** @format */

import type { Grain, Subscriber } from './grain';

// INTERNAL USE ONLY
type GrainValue<T extends readonly Grain[]> = {
    [K in keyof T]: T[K] extends Grain<infer U> ? U : never;
};

type CombinedFn = {
    <Source extends [Grain, ...Grain[]]>(source: Source): Grain<GrainValue<Source>>;
    <Source extends Grain[]>(source: Source): Grain<GrainValue<Source>>;
    <Source extends readonly Grain[]>(source: Source): Grain<GrainValue<Source>>;
};

export const combined: CombinedFn = <Source extends [Grain, ...Grain[]]>(source: Source) => {
    // 1. Synchronous reads evaluate on the fly.
    // It is mathematically impossible for this to ever be stale.
    const read = () => source.map((s) => s()) as GrainValue<Source>;

    return Object.assign(read, {
        subscribe: (subscriber: Subscriber<GrainValue<Source>>) => {
            // 2. When the DOM (or a derived grain) actually subscribes,
            // we wire up the source listeners.
            const unsubscribes = source.map((source) =>
                source.subscribe(() => {
                    // If any source changes, re-evaluate and notify
                    subscriber(read());
                }),
            );

            // 3. When the DOM disconnects, we sever all ties.
            // Zero memory leaks. Zero global context needed.
            return () => {
                for (const fn of unsubscribes) fn();
            };
        },
    });
};
