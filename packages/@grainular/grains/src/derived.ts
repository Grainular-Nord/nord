/** @format */

import { grain, type Grain } from './grain';
import { readonly } from './readonly';

export const derived = <V = unknown, R = V>(source: Grain<V>, run: (value: V) => R) => {
    const result = grain(run(source()));

    source.subscribe((value) => {
        result.set(run(value));
    });

    return readonly(result);
};
