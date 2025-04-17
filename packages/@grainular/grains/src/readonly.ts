/** @format */

import type { Grain } from './grain';

export const readonly = <V>(source: Grain<V>): Grain<V> => {
    return Object.assign(() => source(), {
        subscribe: source.subscribe,
    });
};
