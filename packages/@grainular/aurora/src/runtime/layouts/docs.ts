import { html } from '@grainular/nord';
import type { AuroraLayoutModule } from '../../lib/config/config';
import { renderComponentHost } from '../components/component-host';
import { Navigation } from '../components/navigation/navigation';
import { Outline, outlineDefinition } from '../components/outline/outline';
import { PageLinks } from '../components/page-links/page-links';
import Search from '../components/search/search';
import { searchDefinition } from '../components/search/search-definition';
import { context } from '../store/context';

export const Docs: AuroraLayoutModule['default'] = ({ content, meta, slots }) => {
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
            </main>
            ${slots?.outline?.({}) ?? renderComponentHost(outlineDefinition, Outline, {})}
        </div>
        ${slots?.beforeFooter?.({ meta }) ?? null}
    `;
};
