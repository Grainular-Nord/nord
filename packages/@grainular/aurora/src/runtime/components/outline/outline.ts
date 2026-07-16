import { grain } from '@grainular/grains';
import { $each, html, mounted } from '@grainular/nord';
import type { AuroraComponentDefinition } from '../../../lib/config/config';

type OutlineItem = { label: string; href: string; level: number };

export const Outline = () => {
    const outline = grain<OutlineItem[]>([]);
    const lifecycle = mounted((node) => {
        const headings = Array.from(
            document.querySelectorAll<HTMLElement>(
                '[data-aurora-content] h1[id], [data-aurora-content] h2[id], [data-aurora-content] h3[id]',
            ),
        );
        outline.set(
            headings.map((heading) => ({
                label: heading.textContent?.trim() ?? '',
                href: `#${heading.id}`,
                level: Number(heading.tagName.slice(1)),
            })),
        );

        const setActive = (id: string) => {
            for (const link of Array.from(node.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))) {
                if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible?.target.id) setActive(visible.target.id);
            },
            { rootMargin: '-80px 0px -72% 0px' },
        );

        for (const heading of headings) observer.observe(heading);
        if (headings[0]) setActive(headings[0].id);

        return () => observer.disconnect();
    });

    return html`
        <aside class="aurora-outline" ${lifecycle}>
            <div class="aurora-outline-title">On this page</div>
            ${$each(outline).$as((item) => html`<a href="${item.href}" data-level="${item.level}">${item.label}</a>`)}
        </aside>
    `;
};

export const outlineDefinition: AuroraComponentDefinition = {
    name: 'outline',
    client: true,
    component: async () => ({ default: Outline }),
};
