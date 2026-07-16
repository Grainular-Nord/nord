import { grain, readonly } from '@grainular/grains';

type Theme = 'dark' | 'light';

const identifier = 'aurora.theme';
const storedTheme = () => {
    if (typeof window === 'undefined') return 'dark';

    const documentTheme = document.documentElement.dataset.theme;
    if (documentTheme === 'dark' || documentTheme === 'light') return documentTheme;

    const stored = window.localStorage.getItem(identifier);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const theme = grain<Theme>(storedTheme());

const applyTheme = (value: Theme) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(identifier, value);
    document.documentElement.dataset.theme = value;
};

theme.subscribe(applyTheme);
applyTheme(theme());

export const themeStore = {
    theme: readonly(theme),
    toggle: () => theme.update((current) => (current === 'dark' ? 'light' : 'dark')),
};
