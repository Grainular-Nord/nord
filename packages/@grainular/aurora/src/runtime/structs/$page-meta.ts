import { createStruct } from '@grainular/nord';
import type { AuroraPageMeta } from '../../lib/config/config';
import { escapeHtml } from '../../lib/html/escape-html';

const renderPageMeta = (meta: AuroraPageMeta) => {
    const tags = [
        meta.description && `<meta name="description" content="${escapeHtml(meta.description)}" />`,
        meta.canonical && `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
        meta.robots && `<meta name="robots" content="${escapeHtml(meta.robots)}" />`,
        meta.themeColor && `<meta name="theme-color" content="${escapeHtml(meta.themeColor)}" />`,
        `<title>${escapeHtml(meta.title || 'Aurora')}</title>`,
        typeof meta.head === 'string' ? meta.head : meta.head?.render(),
    ];

    return tags.filter(Boolean).join('\n            ');
};

/** Renders the resolved page metadata into Aurora's generated document head. */
export const $pageMeta = (meta: AuroraPageMeta) =>
    createStruct(
        () => {},
        () => renderPageMeta(meta),
    );
