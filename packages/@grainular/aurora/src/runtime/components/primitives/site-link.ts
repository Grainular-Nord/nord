import { type ComponentFragment, html } from '@grainular/nord';
import type { AuroraLink } from '../../../lib/config/config';
import { isComponentFragment } from '../../lib/is-component-fragment';
import { resolveSiteLink } from '../../lib/resolve-site-link';

export const SiteLink = (item: AuroraLink | ComponentFragment, base: string) => {
    if (isComponentFragment(item)) return item;
    return html`<a href="${resolveSiteLink(item.link, base)}">${item.text}</a>`;
};
