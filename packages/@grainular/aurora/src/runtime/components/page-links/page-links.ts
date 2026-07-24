import { html } from '@grainular/nord';
import type { AuroraLink, AuroraPageLinks } from '../../../lib/config/config';
import { resolveSiteLink } from '../../lib/resolve-site-link';
import { context } from '../../store/context';

const PageLink = (direction: 'prev' | 'next', link?: AuroraLink) => {
    if (!link) return null;

    return html`
        <a
            class="aurora-page-link"
            data-direction="${direction}"
            href="${resolveSiteLink(link.link, context().base ?? '/')}"
        >
            <span>${direction === 'prev' ? 'Previous' : 'Next'}</span>
            <strong>${link.text}</strong>
        </a>
    `;
};

export const PageLinks = ({ prev, next }: AuroraPageLinks) => {
    if (!prev && !next) return null;

    return html`
        <nav class="aurora-page-links" aria-label="Previous and next pages">
            ${PageLink('prev', prev)} ${PageLink('next', next)}
        </nav>
    `;
};
