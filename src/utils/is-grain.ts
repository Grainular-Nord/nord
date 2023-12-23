/** @format */

import { DevGrain } from '../types/dev-grain';
import { isFunction } from './is-function';
import { isNonNull } from './is-non-null';

export const isGrain = (value: any): value is DevGrain =>
    [isNonNull, isFunction, (value: any) => 'isGrain' in value && value.isGrain === true].every((predicate) =>
        predicate(value)
    );
