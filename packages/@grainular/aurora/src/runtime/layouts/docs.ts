import { html } from '@grainular/nord';
import type { AuroraLayoutModule } from '../../lib/config/config';
import { renderComponentHost } from '../components/component-host';
import { Navigation } from '../components/navigation/navigation';
import { Outline, outlineDefinition } from '../components/outline/outline';
import { PageLinks } from '../components/page-links/page-links';

export const Docs: AuroraLayoutModule['default'] = ({ content, meta }) => html`
    <div class="aurora-docs-layout">
        ${Navigation()}
        <main class="application-content docs">
            ${content}
            ${meta.links && PageLinks(meta.links)}
        </main>
        ${renderComponentHost(outlineDefinition, Outline, {})}
    </div>
`;
