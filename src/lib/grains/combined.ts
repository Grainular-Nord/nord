/** @format */

import { ReadonlyGrain } from '../../types';
import { Error } from '../../types/enums/error.enum';
import { GrainValue } from '../../types/grain-value';
import { grain } from './grain';
import { readonly } from './readonly';

/**
 * Creates a new ReadonlyGrain by combining multiple grains.
 * This function allows you to derive a new grain's value based on the values of several other grains.
 * The new grain's value is calculated using a provided function, which takes the current values
 * of all dependent grains as input.
 *
 * @template Dependencies - An array type representing the dependent ReadonlyGrains.
 * @template R - The type of value held by the resulting derived ReadonlyGrain.
 *
 * @param {Dependencies} deps - An array of ReadonlyGrains that the new grain depends on.
 * @param {(values: GrainValue<Dependencies>) => R} fn - A transformation function that takes the current values
 * of the dependent grains and returns the new value for the derived grain.
 * @param {R} [initial] - An optional initial value for the derived grain.
 *
 * @returns {[ReadonlyGrain<R>, () => void]} A tuple containing the derived ReadonlyGrain and a
 * function to unsubscribe the derived grain from all dependent grains' changes.
 *
 * @throws {TypeError} Throws an error if an attempt is made to destroy an already destroyed derived grain.
 *
 * @example
 * // Example of creating a combined ReadonlyGrain
 * const num1$ = grain(3);
 * const num2$ = grain(7);
 * const [sum$, unsubscribe] = combined([num1$, num2$], ([val1, val2]) => val1 + val2);
 *
 * // The combined grain reflects the sum of the values of num1$ and num2$
 * sum$.subscribe(sum => console.log(`Sum: ${sum}`));
 * num1$.set(5); // Updates sum$, logs: Sum: 12
 * num2$.set(10); // Updates sum$, logs: Sum: 15
 */

export const combined = <Dependencies extends [ReadonlyGrain<any>, ...ReadonlyGrain<any>[]], R>(
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
    };

    deps.forEach((grain) => {
        const invalidate = grain.subscribe(() =>
            derived.set(fn(deps.map((grain) => grain()) as GrainValue<Dependencies>))
        );

        _subs.push(invalidate);
    });

    return [readonly(derived), destroy];
};
