import type { Plugin } from 'vite';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { createSitemap } from '../sitemap/create-sitemap';
import { generatedHtmlPages } from './generated-html-pages';

const SITEMAP_FILE = 'sitemap.xml';
const noIndex = (head: string) => /<meta\s+name=["']robots["']\s+content=["'][^"']*\bnoindex\b/i.test(head);

export const pluginAuroraSitemap = (config: ResolvedAuroraConfig): Plugin => {
    let base = '/';

    return {
        name: 'aurora-sitemap',
        configResolved(vite) {
            base = vite.base;
        },
        generateBundle: {
            order: 'post',
            handler(_options, bundle) {
                if (!config.site?.url) return;

                const paths = generatedHtmlPages(bundle).flatMap(({ path, source }) => (noIndex(source) ? [] : [path]));

                this.emitFile({
                    type: 'asset',
                    fileName: SITEMAP_FILE,
                    source: createSitemap(config.site.url, base, paths),
                });
            },
        },
    };
};
