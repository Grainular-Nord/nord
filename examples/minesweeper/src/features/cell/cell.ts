import { html, on } from '@grainular/nord';
import { Icon, icons } from '../../components/icon/icon.component';
import { type Cell as CellModel, gameState } from '../../store/game-state';
import './cell.css';

export type CellProps = { cell: CellModel; idx: number };
export const Cell = ({ cell }: CellProps) => {
    const flagCell = (ev: Event) => {
        ev.preventDefault();
        if (gameState.state() === 'stopped') return;
        cell.flagged.set(!cell.flagged());
    };

    return html`
        <button 
            class="cell"
            data-discovered="${cell.discovered}"
            data-flagged="${cell.flagged}"
            data-explosive="${cell.explosive}"
            data-neighbors="${cell.neighbors}"
            ${on('click', () => gameState.handleCellClick(cell))}
            ${on('contextmenu', flagCell)}
        >
            <div class="cell-flagged">${Icon({ src: icons.flag, size: 16, fill: 'oklch(from var(--color-cyan-400) l c h / 0.6)' })}</div>
            <div class="cell-discovered">${cell.neighbors}</div>
            <div class="cell-explosive">${Icon({ src: icons.bomb, size: 16, fill: 'oklch(from var(--color-rose-500) l c h / 0.6)' })}</div>
        </button>
    `;
};
