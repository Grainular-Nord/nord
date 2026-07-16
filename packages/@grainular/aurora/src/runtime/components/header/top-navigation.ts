import { $each, type ComponentFragment, html } from '@grainular/nord';
import type { AuroraLink } from '../../../lib/config/config';
import { SiteLink } from '../primitives/site-link';

export const TopNavigation = ({ base, items }: { base: string; items: (AuroraLink | ComponentFragment)[] }) => {
    if (items.length === 0) return null;

    return html`
        <nav class="aurora-top-navigation" aria-label="Primary navigation">
            ${$each(() => items).$as((item) => SiteLink(item, base))}
        </nav>
    `;
};
