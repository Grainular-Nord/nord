import { grain } from '@grainular/grains';

export type PlayerSymbol = 'X' | 'O';

export const squares = [...Array.from({ length: 9 }, () => grain<PlayerSymbol | null>(null))];
export const resetSquares = () => {
    for (const square of squares) square.set(null);
};
