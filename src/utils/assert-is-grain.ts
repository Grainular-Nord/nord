/** @format */

import { DevGrain } from '../types/dev-grain';

export const assertIsGrain = (value: any): value is DevGrain => {
    const conditions = [
        (value: any) => value !== null,
        (value: any) => typeof value === 'function',
        (value: any) => 'isGrain' in value && value.isGrain === true,
        (value: any) => 'grainId' in value,
    ];

    return conditions.every((predicate) => predicate(value));
};
