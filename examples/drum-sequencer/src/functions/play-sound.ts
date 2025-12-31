// @ts-expect-error: Fallback context might not be defined
const ctx = new (window.AudioContext || window.webkitAudioContext)();

// Define the used frequencies
// biome-ignore format:   Kick, Snare, HiHat, Clap-ish
const frequencies =      [150,  400,   800,   1200];

export const playSound = (trackIdx: number) => {
    // Create the oscillator and the required
    // gain (volume) for the oscillator.
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    // Get the correct frequency for the track
    // and configure the oscillator
    oscillator.frequency.value = frequencies[trackIdx];
    oscillator.type = trackIdx === 0 ? 'square' : 'sine'; // Kick is square-ish
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);

    // Make sound
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
};
