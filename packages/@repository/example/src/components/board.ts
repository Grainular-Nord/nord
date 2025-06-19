import { $each, $if, html, on } from '@grainular/core';
import { derived } from '@grainular/grains';
import { char } from '../grains/char.grain';
import { gameState } from '../grains/game-state.grain';
import { resetSquares, squares } from '../grains/squares.grain';
import { winner } from '../grains/winner.grain';
import { Square } from './square';

export const Board = () => {
    const handleResetGameClick = () => resetSquares();

    const message = derived(winner, (winner) => (winner ? 'Winner' : 'Next Player'));

    return html`<h1>${message}: ${char}</h1>
        <div class="board">
            ${$each(() => squares)
                .$withKey(() => crypto.randomUUID())
                .$as((field) => Square({ field }))}
        </div>
        ${$if(
            derived(gameState, (state) => state.ended),
            () => html`<button ${on('click', () => handleResetGameClick())}>Restart Game</button>`,
        )}
    `;
};
