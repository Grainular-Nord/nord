import { html } from '@grainular/nord';
import type { AuroraLayoutModule } from '../../lib/config/config';

export const Page: AuroraLayoutModule['default'] = ({ content }) => html`
    <main class="application-content aurora-page-content">${content}</main>
`;
