import { $each, html } from '@grainular/nord';
import type { AuroraRuntimeNavigationItem } from '../../../lib/config/config';
import { resolveSiteLink } from '../../lib/resolve-site-link';
import { context } from '../../store/context';

const NavigationLink = ({ active, label, path }: AuroraRuntimeNavigationItem & { path: string }) =>
    active
        ? html`<a class="aurora-navigation-link" href="${path}" aria-current="page">${label}</a>`
        : html`<a class="aurora-navigation-link" href="${path}">${label}</a>`;

const NavigationNode = (item: AuroraRuntimeNavigationItem) => {
    const label = item.path
        ? NavigationLink({ ...item, path: item.path })
        : html`<div class="aurora-navigation-group">${item.label}</div>`;

    return html`
        <div class="aurora-navigation-item">
            ${label}
            ${
                item.children.length === 0
                    ? null
                    : html`
                          <div class="aurora-navigation-children">
                              ${$each(() => item.children).$as(NavigationNode)}
                          </div>
                      `
            }
        </div>
    `;
};

export const Navigation = () => {
    const { base = '/', logo, routes = [], title = 'Nørd' } = context();
    const brand = logo
        ? html`<img src="${resolveSiteLink(logo, base)}" alt="" />`
        : html`<span class="aurora-brand-mark" aria-hidden="true">N</span>`;

    if (routes.length === 0) return null;

    return html`
        <aside class="aurora-sidebar">
            <a class="aurora-brand" href="${base}" aria-label="${title} home">${brand}<span>${title}</span></a>
            <div class="aurora-sidebar-body">
                <nav id="aurora-sidebar-navigation" class="aurora-navigation" aria-label="Documentation navigation">
                    ${$each(() => routes).$as(NavigationNode)}
                </nav>
            </div>
        </aside>
    `;
};
