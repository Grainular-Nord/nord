import { combined, derived } from '@grainular/grains';
import { gameState } from './game-state.grain';
import { squares } from './squares.grain';

export const char = derived(combined([gameState, ...squares]), ([state, ...squares]) => {
    const result = squares.reduce((acc, cur) => (cur === null ? acc : cur === 'X' ? acc + 1 : acc - 1), 0) > 0;

    if (state.ended) {
        return result ? 'X' : 'O';
    }

    return result ? 'O' : 'X';
});
