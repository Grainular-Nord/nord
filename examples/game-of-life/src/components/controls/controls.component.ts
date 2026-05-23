import { derived } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import { simulationState } from '../../stores/simulation-state';
import './controls.component.css';

export const Controls = () => {
    const { state, actions } = simulationState;
    const { running, generation, stash } = state;

    return html`
        <div class="controls">
            <button data-active="${derived(running, (r) => !r)}" ${on('click', () => actions.stopSimulation())}>⏸️</button>
            <button data-active="${running}" ${on('click', () => actions.startSimulation())}>▶️</button>
            <button ${on('click', () => actions.nextSimulationStep())}>⏩️</button>
            <button disabled="${derived(stash, ({ length }) => length <= 0)}" ${on('click', () => actions.previousSimulationStep())}>⏪️</button>
            <button ${on('click', () => actions.resetSimulation())}>🔄</button>
            <button disabled="${derived(generation, (gen) => gen !== 0)}" ${on('click', () => actions.randomizeCells())}>#️⃣</button>    
        </div>
    `;
};
