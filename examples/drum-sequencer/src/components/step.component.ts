import { combined, derived, type WritableGrain } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import { css, withStyles } from '@grainular/styled';
import { currentStep } from '../grains/state';

type StepProps = { state: WritableGrain<boolean>; stepIdx: number };

export const Step = ({ state, stepIdx }: StepProps) => {
    const classes = derived(combined([state, currentStep]), ([state, currentStep]) => {
        return [state ? 'selected' : '', currentStep === stepIdx ? 'active' : ''].join(' ').trim();
    });

    return withStyles(
        () => html`
            <button
                class="step ${classes}"
                ${on('click', () => state.set(!state()))}
            >
            </button>`,
        () => css`
        .step{ width: 30px; height: 30px; background: #333; border: 2px solid white; }
        .selected { background: #f09; } /* Pink for selected */
        .active { border: 2px solid red; } /* Highlight playhead */`,
    );
};
