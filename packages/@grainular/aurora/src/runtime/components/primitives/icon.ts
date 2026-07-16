import { type ComponentFragment, html } from '@grainular/nord';

export type AuroraIconName = 'discord' | 'github' | 'menu' | 'search' | 'theme';

const icons: Record<AuroraIconName, () => ComponentFragment> = {
    discord: () => html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.2 8.4a9.7 9.7 0 0 1 7.6 0M9 15c2 1 4 1 6 0"></path>
            <circle cx="9" cy="12" r=".7"></circle>
            <circle cx="15" cy="12" r=".7"></circle>
            <path d="M7 5.5c-2 2.8-2.5 5.6-2 8.5 1.8 2 3.6 3.1 5.4 3.5l1.1-1.5h1l1.1 1.5c1.8-.4 3.6-1.5 5.4-3.5.5-2.9 0-5.7-2-8.5l-3-1-1 1h-2l-1-1-3 1Z"></path>
        </svg>
    `,
    github: () => html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7.4A5.7 5.7 0 0 0 19.3 3 5.3 5.3 0 0 0 19.1 0S17.9-.4 15 1.6a13.4 13.4 0 0 0-7 0C5.1-.4 3.9 0 3.9 0a5.3 5.3 0 0 0-.2 3A5.7 5.7 0 0 0 2.2 7.1c0 5.8 3.5 7 6.8 7.4A4.8 4.8 0 0 0 8 18v4"></path>
        </svg>
    `,
    menu: () => html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16"></path>
        </svg>
    `,
    search: () => html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-4-4"></path>
        </svg>
    `,
    theme: () => html`
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path>
        </svg>
    `,
};

export const Icon = ({ name }: { name: AuroraIconName }) => icons[name]();

export const resolveIcon = (icon: string | ComponentFragment) => {
    if (typeof icon !== 'string') return icon;
    if (icon in icons) return Icon({ name: icon as AuroraIconName });
    return html`<span class="aurora-social-fallback">${icon.slice(0, 1)}</span>`;
};
