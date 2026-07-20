import { derived } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import type { AuroraComponentDefinition } from '../../../lib/config/config';
import { themeStore } from '../../store/theme';
import { Icon } from '../primitives/icon';

export const ThemeToggle = () => {
    const label = derived(themeStore.theme, (theme) => `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    const pressed = derived(themeStore.theme, (theme) => theme === 'dark');

    return html`
        <button
            type="button"
            class="aurora-icon-button"
            aria-label="${label}"
            aria-pressed="${pressed}"
            ${on('click', themeStore.toggle)}
        >
            ${Icon({ name: 'theme' })}
        </button>
    `;
};

export const themeToggleDefinition: AuroraComponentDefinition = {
    name: 'theme-toggle',
    client: true,
    component: async () => ({ default: ThemeToggle }),
};
