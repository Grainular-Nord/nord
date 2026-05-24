import { derived } from '@grainular/grains';
import { $each, $if, html, on } from '@grainular/nord';
import { gameState } from '../grains/game-state.grain';
import { resetSquares, squares } from '../grains/squares.grain';
import './board.css';
import { Square } from './square';

export const Board = () => {
    const handleResetGameClick = () => resetSquares();

    const message = derived(gameState, ({ winner }) => (winner ? 'Winner' : 'Next Player'));
    const player = derived(gameState, ({ symbol }) => symbol);

    return html`
        <h1>${message}: ${player}</h1>
        <div class="board">
            ${$each(() => squares).$as((field) => Square({ field }))}
        </div>
        ${$if(derived(gameState, (state) => state.ended)).$then(
            () => html`<button ${on('click', () => handleResetGameClick())}>Restart Game</button>`,
        )}
    `;
};
