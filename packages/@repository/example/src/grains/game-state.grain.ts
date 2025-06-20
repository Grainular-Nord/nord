import { combined, derived } from '@grainular/grains';
import { checkWinner } from '../utils/check-winner';
import { getCurrentPlayerSymbol } from '../utils/get-current-player-symbol';
import { squares } from './squares.grain';

export const gameState = derived(combined(squares), (squares) => {
    const winner = !!checkWinner(squares);
    const ended = winner || squares.every((square) => square !== null);
    const symbol = getCurrentPlayerSymbol(ended, squares);

    return { winner, ended, symbol };
});
