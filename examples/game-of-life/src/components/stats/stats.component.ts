import { html } from '@grainular/nord';
import { simulationState } from '../../stores/simulation-state';
import './stats.component.css';

export const Stats = () => {
    const { state, parameters } = simulationState;
    const { generation, alive } = state;
    const { cols, rows } = parameters;

    return html`
        <div class="statistics">
            <span>Generation: ${generation}</span>
            <span>Alive: ${alive} / ${cols * rows}</span>
        </div>
    `;
};
