import type { AuroraLink, AuroraPageLinks } from '@grainular/aurora';
import { html } from '@grainular/nord';

const TutorialLink = (direction: 'prev' | 'next', link?: AuroraLink) => {
    if (!link) return null;

    return html`
        <a class="tutorial-nav-link" data-direction="${direction}" href="${link.link}">
            <span>${direction === 'prev' ? 'Previous lesson' : 'Next lesson'}</span>
            <strong>${link.text}</strong>
        </a>
    `;
};

export const TutorialNav = ({ prev, next }: AuroraPageLinks) => {
    if (!prev && !next) return null;

    return html`
        <nav class="tutorial-nav" aria-label="Previous and next lesson">
            ${TutorialLink('prev', prev)} ${TutorialLink('next', next)}
        </nav>
    `;
};
