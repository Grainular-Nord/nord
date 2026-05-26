import { $each, html } from '@grainular/nord';
import { gameState } from '../../store/game-state';
import { Cell } from '../cell/cell';

export const GameField = () => {
    return html`
        <div class="flex flex-direction items-center justify-center min-w-sm">
            <div class="aspect-square grid gap-1" style="--size: ${gameState.size}">
                ${$each(gameState.cells).$as((cell, idx) => {
                    return Cell({ cell, idx });
                })}
            </div>
        </div>`;
};
