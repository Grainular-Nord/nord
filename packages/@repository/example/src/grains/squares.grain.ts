import { grain } from '@grainular/grains';

export const squares = [...Array.from({ length: 9 }, () => grain<'X' | 'O' | null>(null))];
export const resetSquares = () => {
    for (const square of squares) square.set(null);
};
