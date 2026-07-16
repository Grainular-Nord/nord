import { html, mounted, on } from '@grainular/nord';
import type { AuroraComponentDefinition } from '../../../lib/config/config';
import { Icon } from '../primitives/icon';

const backgroundElements = (application: HTMLElement, toggle: HTMLElement) =>
    Array.from(
        application.querySelectorAll<HTMLElement>(
            '.aurora-header > *, .application-shell main, .aurora-outline, .aurora-footer',
        ),
    ).filter((element) => !element.contains(toggle));

const setNavigationOpen = (application: HTMLElement, button: HTMLElement, open: boolean, restoreFocus = true) => {
    application.toggleAttribute('data-navigation-open', open);
    button.setAttribute('aria-expanded', String(open));
    for (const element of backgroundElements(application, button)) element.inert = open;

    if (open) {
        window.setTimeout(() => {
            if (!application.hasAttribute('data-navigation-open')) return;
            application.querySelector<HTMLElement>('.aurora-sidebar-body a')?.focus();
        });
    } else if (restoreFocus) {
        button.focus();
    }
};

export const NavigationToggle = () => {
    const lifecycle = mounted((node) => {
        const application = node.closest<HTMLElement>('.aurora-app');
        if (!application) return;

        const close = (restoreFocus = true) => setNavigationOpen(application, node, false, restoreFocus);
        const keyboard = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
        };
        const dismiss = (event: MouseEvent) => {
            const target = event.target as Element | null;
            if (target?.closest('.aurora-navigation-backdrop')) close();
            else if (target?.closest('.aurora-navigation-link')) close(false);
        };

        document.addEventListener('keydown', keyboard);
        document.addEventListener('click', dismiss);
        return () => {
            document.removeEventListener('keydown', keyboard);
            document.removeEventListener('click', dismiss);
            setNavigationOpen(application, node, false, false);
        };
    });

    const toggle = (event: Event) => {
        const button = event.currentTarget as HTMLButtonElement;
        const application = button.closest<HTMLElement>('.aurora-app');
        if (!application) return;
        setNavigationOpen(application, button, !application.hasAttribute('data-navigation-open'));
    };

    return html`
        <button
            class="aurora-navigation-toggle aurora-icon-button"
            type="button"
            aria-label="Toggle navigation"
            aria-controls="aurora-sidebar-navigation"
            aria-expanded="false"
            ${lifecycle}
            ${on('click', toggle)}
        >
            ${Icon({ name: 'menu' })}
        </button>
    `;
};

export const navigationToggleDefinition: AuroraComponentDefinition = {
    name: 'navigation-toggle',
    client: true,
    component: async () => ({ default: NavigationToggle }),
};
