import { $each, type ComponentFragment, html } from '@grainular/nord';
import type { AuroraRuntimeNavigationItem } from '../../../lib/config/config';
import { resolveSiteLink } from '../../lib/resolve-site-link';
import { context } from '../../store/context';

const NavigationLink = ({ active, label, path }: AuroraRuntimeNavigationItem & { path: string }) =>
    active
        ? html`<a class="aurora-navigation-link" href="${path}" aria-current="page">${label}</a>`
        : html`<a class="aurora-navigation-link" href="${path}">${label}</a>`;

const NavigationChildren = (children: AuroraRuntimeNavigationItem[]): ComponentFragment => html`
    <div class="aurora-navigation-children">
        ${$each(() => children).$as(NavigationNode)}
    </div>
`;

const NavigationNode = (item: AuroraRuntimeNavigationItem): ComponentFragment => {
    const label = item.path
        ? NavigationLink({ ...item, path: item.path })
        : html`<div class="aurora-navigation-group-label">${item.label}</div>`;

    return html`
        <div class="aurora-navigation-item">
            ${label}
            ${item.children.length > 0 ? NavigationChildren(item.children) : null}
        </div>
    `;
};

const NavigationRoot = (item: AuroraRuntimeNavigationItem) => {
    if (item.path) return NavigationNode(item);

    return html`
        <details class="aurora-navigation-group" open>
            <summary>
                <span>${item.label}</span>
                <svg class="aurora-navigation-group-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </summary>
            ${NavigationChildren(item.children)}
        </details>
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
                    ${$each(() => routes).$as(NavigationRoot)}
                </nav>
            </div>
        </aside>
    `;
};
