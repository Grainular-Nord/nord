import { derived, grain } from '@grainular/grains';

export const state = grain({ bpm: 120, playing: false, currentStep: 0 });
export const currentStep = derived(state, (state) => state.currentStep);
