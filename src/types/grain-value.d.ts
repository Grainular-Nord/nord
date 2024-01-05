/** @format */

import { ReadonlyGrain } from './readonly-grain';

/**
 * This is considered a private API. This type should probably not be used outside the library.
 */

export type GrainValue<T extends readonly ReadonlyGrain<any>[]> = {
    [K in keyof T]: T[K] extends ReadonlyGrain<infer U> ? U : never;
};
