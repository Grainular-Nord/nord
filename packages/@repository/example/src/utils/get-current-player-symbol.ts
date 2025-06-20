import type { PlayerSymbol } from '../grains/squares.grain';

export const getCurrentPlayerSymbol = (ended: boolean, squares: (PlayerSymbol | null)[]): PlayerSymbol => {
    const result = squares.reduce((acc, cur) => (cur === null ? acc : cur === 'X' ? acc + 1 : acc - 1), 0) > 0;

    if (ended) {
        return result ? 'X' : 'O';
    }

    return result ? 'O' : 'X';
};
