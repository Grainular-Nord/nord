import { combined, derived } from '@grainular/grains';
import { squares } from './squares.grain';
import { winner } from './winner.grain';

export const gameState = derived(combined([winner, ...squares]), ([winner, ...squares]) => {
    return {
        ended: winner || squares.every((square) => square !== null),
    };
});

gameState.subscribe((state) => console.log(state));
