import { createStruct } from '@grainular/nord';
import type { AuroraPageConfig, AuroraPageMeta } from '../../lib/config/config';
import { escapeHtml } from '../../lib/utils/escape-html';

type SocialMeta = {
    image?: string;
    siteName?: string;
    url?: string;
};

const tag = (attribute: 'name' | 'property', name: string, content?: string) =>
    content && `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`;

const renderPageMeta = (meta: AuroraPageConfig & AuroraPageMeta, social: SocialMeta) => {
    const title = meta.title || 'Aurora';
    const tags = [
        tag('name', 'description', meta.description),
        tag('name', 'robots', meta.robots),
        tag('name', 'theme-color', meta.themeColor),
        `<title>${escapeHtml(title)}</title>`,
        tag('property', 'og:type', 'website'),
        tag('property', 'og:title', title),
        tag('property', 'og:description', meta.description),
        tag('property', 'og:site_name', social.siteName),
        tag('property', 'og:url', social.url),
        tag('property', 'og:image', social.image),
        tag('name', 'twitter:card', social.image ? 'summary_large_image' : 'summary'),
        tag('name', 'twitter:title', title),
        tag('name', 'twitter:description', meta.description),
        tag('name', 'twitter:image', social.image),
        typeof meta.head === 'string' ? meta.head : meta.head?.render(),
    ];

    return tags.filter(Boolean).join('\n            ');
};

/** Renders the resolved page metadata into Aurora's generated document head. */
export const $pageMeta = (meta: AuroraPageConfig & AuroraPageMeta, social: SocialMeta = {}) =>
    createStruct(
        () => {},
        () => renderPageMeta(meta, social),
    );
