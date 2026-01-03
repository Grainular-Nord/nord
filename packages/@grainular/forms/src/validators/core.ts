import type { WritableGrain } from '@grainular/grains';

type HasError = { errors: WritableGrain<string[]> };
export const setControlError = (control: HasError, message: string) => {
    control.errors.update((errors) => {
        return [...new Set([...(errors ?? []), message])];
    });
};

export const clearControlError = (control: HasError, message: string) => {
    control.errors.update((errors) => {
        return [...new Set([...(errors ?? []).filter((msg) => msg !== message)])];
    });
};
