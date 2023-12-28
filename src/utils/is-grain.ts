/** @format */

import { ReadonlyGrain } from '../types/readonly-grain';
import { isFunction } from './is-function';
import { isNonNull } from './is-non-null';

export const isGrain = (value: any): value is ReadonlyGrain<any> =>
    [isNonNull, isFunction, (value: any) => 'subscribe' in value && typeof value.subscribe === 'function'].every(
        (predicate) => predicate(value)
    );
