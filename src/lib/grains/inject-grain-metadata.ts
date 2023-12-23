/** @format */

import { ReadonlyGrain } from '../../types';

export const øInjectGrainMetaData = (grain: ReadonlyGrain<any>) => {
    // Add a unique identifier to the grain, as well as a isGrain flag. Both should be non enumerable
    Object.defineProperties(grain, {
        grainId: {
            enumerable: false,
            writable: false,
            value: crypto.randomUUID(),
        },
        isGrain: {
            enumerable: false,
            writable: false,
            value: true,
        },
    });
};
