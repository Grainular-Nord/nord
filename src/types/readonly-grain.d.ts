/** @format */

export type ReadonlyGrain<V> = Omit<Grain<V>, 'set' | 'update'>;
