/** @format */

import { ReadonlyGrain } from '../../types';

export const øInjectGrainMetaData = (grain: Omit<ReadonlyGrain<any>, 'isGrain'>) => {
    // Add a unique identifier to the grain, as well as a isGrain flag. Both should be non enumerable
    Object.defineProperties(grain, {
        isGrain: {
            enumerable: false,
            writable: false,
            value: true,
        },
    });
};
