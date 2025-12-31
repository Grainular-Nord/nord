/** @format */

import type { PlayerSymbol } from '../grains/squares.grain';

export const checkWinner = (board: (PlayerSymbol | null)[]) => {
    // Map each cell to its corresponding magic square number
    const magicSquare = [2, 7, 6, 9, 5, 1, 4, 3, 8];

    // Sum for 'X' and 'O'

    const checkWin = (player: PlayerSymbol | null): boolean => {
        const playerPositions = magicSquare.filter((_, i) => board[i] === player);
        for (let i = 0; i < playerPositions.length - 2; i++) {
            for (let j = i + 1; j < playerPositions.length - 1; j++) {
                for (let k = j + 1; k < playerPositions.length; k++) {
                    if (playerPositions[i] + playerPositions[j] + playerPositions[k] === 15) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    if (checkWin('X')) return 'X';
    if (checkWin('O')) return 'O';

    return null;
};
