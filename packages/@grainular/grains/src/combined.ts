/** @format */

import { grain, type Grain } from './grain';
import { readonly } from './readonly';

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
    // We create a internally writable grain that tracks all the grains values
    const result = grain(source.map((value) => value()) as GrainValue<Source>);

    // For each of the sources grains, we want to subscribe, track the corresponding
    // index and then update the result grain with the correct value. As we want the combined
    // grain to be always up to date, we must subscribe here once and then never unsubscribe,
    // as tracking subscription state would mean that the value only updates after a subscription
    // is added, which is not what we want. (Grains are more signal like, and should always update
    // their corresponding state)
    source.forEach((source, idx) => {
        source.subscribe((value) => {
            result.update((current) => {
                current[idx] = value;
                return [...current];
            });
        });
    });

    // We can finally return the created grain as readonly grain
    return readonly(result);
};
