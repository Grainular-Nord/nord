import { grain, readonly } from '@grainular/grains';

const initial = grain(0);
const time = grain(0);
const state = grain<'stopped' | 'running'>('stopped');

let interval: number | null = null;

state.subscribe((currentState) => {
    // Clear existing interval to prevent leaks
    if (interval) {
        clearInterval(interval);
        interval = null;
    }

    if (currentState !== 'running') return;

    interval = window.setInterval(() => {
        const remaining = time();

        // Guard clause for countdown completion
        if (remaining <= 0) {
            state.set('stopped');
            return;
        }

        time.set(remaining - 1);
    }, 1000);
});

export const timer = {
    setTimer: (value: number) => {
        initial.set(value);
        time.set(value);
    },
    resetTimer: () => {
        state.set('stopped');
        time.set(initial());
    },
    startTimer: () => {
        // Only start if there is time to count down
        if (time() > 0) {
            state.set('running');
        }
    },
    stopTimer: () => {
        state.set('stopped');
    },
    time: readonly(time),
    state: readonly(state),
};
