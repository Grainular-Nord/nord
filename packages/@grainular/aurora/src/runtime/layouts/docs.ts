import { html } from '@grainular/nord';
import type { AuroraLayoutModule } from '../../lib/config/config';
import { renderComponentHost } from '../components/component-host';
import { Navigation } from '../components/navigation/navigation';
import { Outline, outlineDefinition } from '../components/outline/outline';
import { PageLinks } from '../components/page-links/page-links';
import Search from '../components/search/search';
import { searchDefinition } from '../components/search/search-definition';
import { context } from '../store/context';

const PageDetails = ({ source, lastUpdated }: { source?: string; lastUpdated?: string }) => {
    if (!source && !lastUpdated) return null;

    return html`
        <footer class="aurora-page-details">
            ${source &&
            html`<a class="aurora-source-link" href="${source}" rel="noopener noreferrer" target="_blank">
                See source
            </a>`}
            ${lastUpdated &&
            html`<p class="aurora-last-updated">Last updated <time datetime=${lastUpdated}>${lastUpdated}</time></p>`}
        </footer>
    `;
};

export const Docs: AuroraLayoutModule['default'] = ({ content, lastUpdated, meta, slots }) => {
    const { base = '/', search } = context();

    return html`
        <div class="aurora-docs-layout">
            ${slots?.search?.({}) ??
            (search
                ? renderComponentHost(searchDefinition, Search, { index: `${base}aurora-search.json`, base })
                : null)}
            ${slots?.sidebar?.({}) ?? Navigation()}
            <main class="application-content docs">
                ${slots?.beforeContent?.({ meta }) ?? null} ${content}
                ${slots?.pageLinks?.({ meta }) ?? (meta.links && PageLinks(meta.links))}
                ${PageDetails({ source: meta.source, lastUpdated })}
            </main>
            ${slots?.outline?.({ meta }) ??
            renderComponentHost(outlineDefinition, Outline, { headings: meta.headings ?? [] })}
        </div>
        ${slots?.beforeFooter?.({ meta }) ?? null}
    `;
};
