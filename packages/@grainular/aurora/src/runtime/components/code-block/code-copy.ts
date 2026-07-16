import { grain } from '@grainular/grains';
import { html, mounted, on } from '@grainular/nord';
import type { AuroraComponentDefinition } from '../../../lib/config/config';

export const CodeCopy = () => {
    const label = grain('Copy');
    let reset: number | undefined;

    const lifecycle = mounted(() => () => window.clearTimeout(reset));
    const copy = async (event: Event) => {
        const button = event.currentTarget as HTMLButtonElement;
        const code = button.closest('.aurora-code-block')?.querySelector('code')?.textContent;
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            label.set('Copied');
        } catch {
            label.set('Copy failed');
        }

        window.clearTimeout(reset);
        reset = window.setTimeout(() => label.set('Copy'), 1600);
    };

    return html`
        <button type="button" class="aurora-code-copy" aria-live="polite" ${lifecycle} ${on('click', copy)}>
            ${label}
        </button>
    `;
};

export const codeCopyDefinition: AuroraComponentDefinition = {
    name: 'code-copy',
    client: true,
    component: async () => ({ default: CodeCopy }),
};
