import { grid } from '../grains/grid';
import { state } from '../grains/state';
import { playSound } from './play-sound';

let interval: ReturnType<typeof setInterval> | null = null;

export const togglePlay = () => {
    // If we are currently playing, we stop the
    // interval and set the respective state grain
    // to false.
    if (state().playing) {
        state.update((state) => ({ ...state, playing: false }));
        clearInterval(interval ?? 0);
        return;
    }

    // If we are not playing, we create our interval timer
    // to update our current step state, as well as play the
    // correct and respective sound.
    if (!state().playing) {
        state.update((state) => ({ ...state, playing: true }));
        const ms = 60000 / state().bpm / 4;

        interval = setInterval(() => {
            // Update the current step so we
            state.update((state) => {
                return { ...state, currentStep: (state.currentStep + 1) % 16 };
            });

            // Play the correct sound based on the current step
            grid.forEach((track, idx) => {
                if (track[state().currentStep]()) playSound(idx);
            });
        }, ms);
    }
};
