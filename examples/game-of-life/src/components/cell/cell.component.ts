import type { WritableGrain } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import './cell.component.css';

export type CellProps = { state: WritableGrain<boolean> };
export const Cell = ({ state }: CellProps) => {
    const toggleCellState = () => {
        state.update((current) => !current);
    };

    return html`
        <div 
            class="cell" data-state="${state}" 
            ${on('click', toggleCellState)}
        ></div>
    `;
};
