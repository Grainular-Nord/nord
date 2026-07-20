import { html, mounted } from '@grainular/nord';
import type { AuroraComponentDefinition } from '../../../lib/config/config';
import { Icon } from '../primitives/icon';

const inactiveContent =
    '.aurora-header > :not(.aurora-navigation-toggle-host), .application-shell main, .aurora-outline, .aurora-footer';

export const NavigationToggle = () => {
    const onMount = mounted((button) => {
        const btn = button as HTMLButtonElement;
        const application = btn.closest<HTMLElement>('.aurora-app')!;

        const setOpen = (open: boolean) => {
            application.toggleAttribute('data-navigation-open', open);
            btn.ariaExpanded = String(open);
            for (const element of application.querySelectorAll<HTMLElement>(inactiveContent)) element.inert = open;
            if (open) application.querySelector<HTMLElement>('.aurora-sidebar-body a')?.focus();
        };

        const close = () => {
            setOpen(false);
            btn.focus();
        };

        const dismiss = (event: Event) => {
            if (event instanceof KeyboardEvent && event.key === 'Escape') close();
            if (event.target instanceof Element && event.target.closest('.aurora-navigation-backdrop')) close();
        };

        const toggle = () => setOpen(!application.hasAttribute('data-navigation-open'));

        btn.addEventListener('click', toggle);
        document.addEventListener('keydown', dismiss);
        document.addEventListener('click', dismiss);
        return () => {
            btn.removeEventListener('click', toggle);
            document.removeEventListener('keydown', dismiss);
            document.removeEventListener('click', dismiss);
            setOpen(false);
        };
    });

    return html`
        <button
            class="aurora-navigation-toggle aurora-icon-button"
            type="button"
            aria-label="Toggle navigation"
            aria-controls="aurora-sidebar-navigation"
            aria-expanded="false"
            ${onMount}
        >
            ${Icon({ name: 'menu' })}
        </button>
    `;
};

export const navigationToggleDefinition: AuroraComponentDefinition = {
    name: 'navigation-toggle',
    client: true,
    component: async () => ({ default: NavigationToggle }),
    host: { class: 'aurora-navigation-toggle-host' },
};
