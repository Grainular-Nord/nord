import { $each, html, mounted } from '@grainular/nord';
import type { AuroraComponentDefinition, AuroraHeading } from '../../../lib/config/config';

type OutlineLink = { label: string; href: string };
type OutlineSection = OutlineLink & { children: OutlineLink[] };

const createSections = (headings: AuroraHeading[]): OutlineSection[] => {
    const sections: OutlineSection[] = [];

    for (const heading of headings) {
        if (heading.level !== 2 && heading.level !== 3) continue;
        if (!heading.id) return [];

        const link = { label: heading.label, href: `#${heading.id}` };
        if (heading.level === 2) sections.push({ ...link, children: [] });
        else {
            const section = sections.at(-1);
            if (!section) return [];
            section.children.push(link);
        }
    }

    return sections;
};

const OutlineSectionView = ({ children, href, label }: OutlineSection) => html`
    <li>
        <a href="${href}">${label}</a>
        ${children.length > 0
            ? html`<ul class="aurora-outline-children">
                  ${$each(() => children).$as(
                      ({ href, label }: OutlineLink) => html`<li><a href="${href}">${label}</a></li>`,
                  )}
              </ul>`
            : null}
    </li>
`;

export const Outline = ({ headings }: { headings: AuroraHeading[] }) => {
    const sections = createSections(headings);
    if (sections.length === 0) return html``;

    return html`
        <aside class="aurora-outline" ${mounted(activateOutline)}>
            <div class="aurora-outline-title">On this page</div>
            <ul class="aurora-outline-list">
                ${$each(() => sections).$as(OutlineSectionView)}
            </ul>
        </aside>
    `;
};

const activateOutline = (outline: Element) => {
    const links = [...outline.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const headings = [
        ...document.querySelectorAll<HTMLHeadingElement>('[data-aurora-content] h2[id], [data-aurora-content] h3[id]'),
    ];
    const firstHeading = headings[0];
    if (!firstHeading) return () => {};

    const activate = (id: string) => {
        for (const link of links) {
            if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        }
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries.find((entry) => entry.isIntersecting);
            if (visible?.target.id) activate(visible.target.id);
        },
        { rootMargin: '-80px 0px -72% 0px' },
    );

    for (const heading of headings) observer.observe(heading);
    activate(firstHeading.id);

    return () => observer.disconnect();
};

export const outlineDefinition: AuroraComponentDefinition = {
    name: 'outline',
    client: true,
    component: async () => ({ default: Outline }),
};
