import { $each, css, html, withScopedStyles } from '@grainular/nord';
import { gameState } from '../../store/game-state';
import { Cell } from '../cell/cell';

export const GameField = withScopedStyles(
    () => {
        return html`
        <div class="flex flex-direction items-center justify-center min-w-sm">
            <div class="aspect-square grid gap-1" style="--size: ${gameState.size}">
                ${$each(gameState.cells).$as((cell, idx) => {
                    return Cell({ cell, idx });
                })}
            </div>
        </div>`;
    },
    css`
    .grid {
        grid-template-columns: repeat(var(--size), 1fr);
        grid-template-rows: repeat(var(--size), 1fr);
    }`,
);
