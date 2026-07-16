import type { Plugin } from 'vite';
import { findDeadLinks } from '../links/find-dead-links';
import { generatedHtmlPages } from './generated-html-pages';

export const pluginAuroraLinks = (): Plugin => {
    let base = '/';

    return {
        name: 'aurora-links',
        configResolved(vite) {
            base = vite.base;
        },
        generateBundle: {
            order: 'post',
            handler(_options, bundle) {
                const links = findDeadLinks(generatedHtmlPages(bundle), base);
                if (links.length === 0) return;

                this.error(`Dead links found:\n${links.map(({ page, href }) => `  ${page} → ${href}`).join('\n')}`);
            },
        },
    };
};
