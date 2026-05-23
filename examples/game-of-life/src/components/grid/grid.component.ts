import { $each, html, mounted } from '@grainular/nord';
import { simulationState } from '../../stores/simulation-state';
import { Cell } from '../cell/cell.component';
import './grid.component.css';

export const Grid = () => {
    const { state, parameters, actions } = simulationState;
    const { cols, rows } = parameters;
    const { cells } = state;

    return html`
        <main style="--cols: ${cols}; --rows: ${rows}" class="grid" ${mounted(() => () => actions.stopSimulation())}>
            ${$each(() => cells).$as((cellY) => {
                return html`${$each(() => cellY).$as((cell) => {
                    return Cell({ state: cell });
                })}`;
            })}
        </main>
    `;
};
