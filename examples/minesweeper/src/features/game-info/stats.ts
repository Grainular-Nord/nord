import { combined, derived, flattened } from '@grainular/grains';
import { html } from '@grainular/nord';
import { Icon, icons } from '../../components/icon/icon.component';
import { gameState } from '../../store/game-state';

export const Stats = () => {
    const flags = derived(
        flattened(
            derived(gameState.cells, (cells) => {
                return combined(cells.map((cell) => cell.flagged));
            }),
        ),
        (states) => states.filter(Boolean).length,
    );
    const revealed = derived(
        flattened(
            derived(gameState.cells, (cells) => {
                return combined(cells.map((cell) => cell.discovered));
            }),
        ),
        (states) => states.filter(Boolean).length,
    );

    return html`
        <div class="flex flex-row gap-2 items-center ml-auto text-stone-400">
            <span class="flex flex-row gap-1 items-center text-sm">
                ${Icon({ src: icons.clock, size: 16 })} ${gameState.time}
            </span>
            <span class="flex flex-row gap-1 items-center text-sm">
                ${Icon({ src: icons.plot, size: 16 })} ${flags}
            </span>
            <span class="flex flex-row gap-1 items-center text-sm">
                ${Icon({ src: icons.grid, size: 16 })} ${revealed}
            </span>
        </div>
    `;
};
