/** @format */

/**
 * This is considered a private API. This type should probably not be used.
 */

export type GrainValue<T extends Grain<any>[]> = {
    [K in keyof T]: T[K] extends Grain<infer U> ? U : never;
};
