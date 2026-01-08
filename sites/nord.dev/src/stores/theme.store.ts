import { grain, readonly } from '@grainular/grains';

// Store the theme in a grain and
// update on changes and sync to storage
const theme = grain<string>('dark');
theme.subscribe((theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('nord.dev-theme', theme);
});

// Find the initial system theme or stored theme
// We set here again to trigger the subscription
const stored = window.localStorage.getItem('nord.dev-theme') ?? null;
theme.set(stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

// Expose the store explicitly via a themeStore object
export const themeStore = {
    theme: readonly(theme),
    toggle: () => {
        theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
    },
};
