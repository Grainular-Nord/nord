import { grain } from '@grainular/grains';

// The grid, tracking the 'pad' state as boolean.
// We use an nested array of grains here, as we will
// never restructure the array, only toggle it's content
// on and off. This make the update very efficient
export const grid = Array.from({ length: 4 }, () => {
    return [
        ...Array.from({ length: 16 }, () => {
            return grain<boolean>(false);
        }),
    ];
});
