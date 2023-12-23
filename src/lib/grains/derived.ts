/** @format */

import { ReadonlyGrain } from '../../types';
import { Error } from '../../types/enums/error.enum';
import { GrainValue } from '../../types/grain-value';
import { grain } from './grain';
import { readonly } from './readonly';

export const derived = <Dependencies extends [ReadonlyGrain<any>, ...ReadonlyGrain<any>[]], R>(
    deps: Dependencies,
    fn: (values: GrainValue<Dependencies>) => R,
    initial?: R
): [ReadonlyGrain<R>, () => void] => {
    const _initial = initial ?? fn(deps.map((grain) => grain()) as GrainValue<Dependencies>);
    const derived = grain(_initial);

    let destroyed = false;
    const _subs: (() => void)[] = [];
    const destroy = () => {
        if (!destroyed) {
            _subs.forEach((sub) => sub());
            destroyed = true;
            return;
        }

        throw new TypeError(Error.DERIVED_ALREADY_DESTROYED);
    };

    deps.forEach((grain) => {
        const invalidate = grain.subscribe(() =>
            derived.set(fn(deps.map((grain) => grain()) as GrainValue<Dependencies>))
        );

        _subs.push(invalidate);
    });

    return [readonly(derived), destroy];
};
