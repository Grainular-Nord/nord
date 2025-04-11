/** @format */

import type { Grain } from './grain';

export const readonly = <V>(source: Grain<V>): Grain<V> => {
    const readonly = () => source();
    readonly['subscribe'] = source.subscribe;

    return readonly;
};
