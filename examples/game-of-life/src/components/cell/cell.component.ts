import type { WritableGrain } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import './cell.component.css';

export type CellProps = { state: WritableGrain<boolean>; onToggle: () => void };
export const Cell = ({ state, onToggle }: CellProps) => {
    return html`
        <div 
            class="cell" data-state="${state}" 
            ${on('click', onToggle)}
        ></div>
    `;
};
