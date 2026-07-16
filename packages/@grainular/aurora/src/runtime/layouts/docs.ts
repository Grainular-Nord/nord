import { html } from '@grainular/nord';
import type { AuroraLayoutModule } from '../../lib/config/config';
import { renderComponentHost } from '../components/component-host';
import { Navigation } from '../components/navigation/navigation';
import { Outline, outlineDefinition } from '../components/outline/outline';

export const Docs: AuroraLayoutModule['default'] = ({ content }) => html`
    <div class="aurora-docs-layout">
        ${Navigation()}
        <main class="application-content docs">${content}</main>
        ${renderComponentHost(outlineDefinition, Outline, {})}
    </div>
`;
