import { derived, type Grain, readonly } from '@grainular/grains';

export const parameterized = (internal: Grain<Record<string, string>>) => {
    const read = readonly(internal);

    return Object.assign(read, {
        select: <K extends string>(fn: (params: Record<K, string>) => string) => {
            return derived(internal, fn as (params: Record<string, string>) => string);
        },
    });
};
