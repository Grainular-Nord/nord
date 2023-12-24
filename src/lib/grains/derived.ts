/** @format */

import { ReadonlyGrain } from '../../types';
import { grain } from './grain';
import { readonly } from './readonly';

export const derived = <T, R = T>(value: ReadonlyGrain<T>, run: (value: T) => R): [ReadonlyGrain<R>, () => void] => {
    const _grain = grain<R>(run(value()));
    const unsubscribe = value.subscribe((v) => _grain.set(run(v)));
    return [readonly(_grain), () => unsubscribe()];
};
