import { type ComponentFragment, html } from '@grainular/nord';
import type { AuroraLayoutModule, AuroraPageMeta } from '../lib/config/config';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

export type AppProps = {
    content: ComponentFragment;
    meta: AuroraPageMeta;
    layouts: Map<string, AuroraLayoutModule['default']>;
};
export const App = ({ content, layouts, meta }: AppProps) => {
    // The built-in `page` layout is always registered, so the fallback chain
    // resolves even when `meta.layout` names an unknown layout.
    const layout = (layouts.get(meta.layout ?? 'page') ?? layouts.get('page'))!;
    const staticContent = html`<div data-aurora-content>${content}</div>`;

    return html`
        <div class="aurora-app">
            <a class="aurora-skip-link" href="#aurora-main-content">Skip to main content</a>
            <div class="aurora-background" aria-hidden="true"></div>
            ${Header()}
            <button class="aurora-navigation-backdrop" type="button" tabindex="-1" aria-label="Close navigation"></button>
            <div id="aurora-main-content" class="application-shell" tabindex="-1">
                ${layout({ content: staticContent, meta })}
            </div>
            ${Footer()}
        </div>
    `;
};
