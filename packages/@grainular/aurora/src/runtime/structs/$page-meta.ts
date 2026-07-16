import { createStruct } from '@grainular/nord';
import type { AuroraPageConfig, AuroraPageMeta } from '../../lib/config/config';
import { escapeHtml } from '../../lib/utils/escape-html';

const renderPageMeta = (meta: AuroraPageConfig & AuroraPageMeta) => {
    const tags = [
        meta.description && `<meta name="description" content="${escapeHtml(meta.description)}" />`,
        meta.robots && `<meta name="robots" content="${escapeHtml(meta.robots)}" />`,
        meta.themeColor && `<meta name="theme-color" content="${escapeHtml(meta.themeColor)}" />`,
        `<title>${escapeHtml(meta.title || 'Aurora')}</title>`,
        typeof meta.head === 'string' ? meta.head : meta.head?.render(),
    ];

    return tags.filter(Boolean).join('\n            ');
};

/** Renders the resolved page metadata into Aurora's generated document head. */
export const $pageMeta = (meta: AuroraPageConfig & AuroraPageMeta) =>
    createStruct(
        () => {},
        () => renderPageMeta(meta),
    );
