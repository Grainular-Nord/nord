import { derived } from '@grainular/grains';
import { $each, html, on } from '@grainular/nord';
import { css, withStyles } from '@grainular/styled';
import { togglePlay } from '../functions/toggle-play';
import { grid } from '../grains/grid';
import { state } from '../grains/state';
import { Step } from './step.component';

export const Sequencer = () => {
    const playingLabel = derived(state, ({ playing }) => (playing ? 'Stop' : 'Play'));
    const bpm = derived(state, (state) => state.bpm);

    const handleBpmUpdate = (event: Event) => {
        const value = Number.parseInt((event.target as HTMLInputElement).value ?? '120');
        state.update((state) => {
            return { ...state, bpm: value };
        });
    };

    return withStyles(
        () => html`
        <div class="controls">
            <button ${on('click', togglePlay)}> ${playingLabel} </button>
            <input type="range" min="60" max="200" value="${bpm}" ${on('input', handleBpmUpdate)} />
            <span>${bpm} BPM</span>
        </div>
        <div class="grid">
            ${$each(() => grid).$as(
                (track, trackIdx) => html`
                <div class="track">
                    <div class="label">Track ${trackIdx + 1}</div>
                    ${$each(() => track).$as((step, stepIdx) => {
                        return Step({ state: step, stepIdx });
                    })}
                </div>`,
            )}
        </div>`,
        () => css` 
        .grid { display: flex; flex-direction: column; gap: 4px; }
        .track { display: flex; gap: 4px; align-items: center; }`,
    );
};
