import { combined, derived } from '@grainular/grains';
import { checkWinner } from '../utils/check-winner';
import { squares } from './squares.grain';

export const winner = derived(combined(squares), (squares) => {
    return !!checkWinner(squares);
});
