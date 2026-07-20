import type { Plugin } from 'vite';
import type { AuroraStaticPage } from '../config/config';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { renderStaticPages } from '../render/render-static-pages';
import { createClientEntry } from '../virtual/client-entry';
import { AURORA_CLIENT_ENTRY } from './constants';
import { createIndexHtml } from './create-index-html';
import { devPageMiddleware } from './dev-page-middleware';
import { previewPageMiddleware } from './preview-page-middleware';

export const pluginAuroraCore = (config: ResolvedAuroraConfig): Plugin => {
    const resolvedClientEntry = `\0${AURORA_CLIENT_ENTRY}`;
    let base = '/';
    let command: 'build' | 'serve' = 'serve';
    let pages: AuroraStaticPage[] = [];

    return {
        name: 'aurora-core',
        config() {
            return {
                appType: 'custom',
                build: { rollupOptions: { input: AURORA_CLIENT_ENTRY } },
            };
        },
        configResolved(vite) {
            base = vite.base;
            command = vite.command;
        },
        async buildStart() {
            if (command === 'build') pages = await renderStaticPages(config, base);
        },
        generateBundle(_options, bundle) {
            if (pages.length === 0) return;

            const entry = Object.values(bundle).filter((output) => output.type === 'chunk' && output.isEntry)[0];

            const stylesheets = Object.values(bundle)
                .filter((output) => output.type === 'asset' && output.fileName.endsWith('.css'))
                .map((output) => output.fileName);

            for (const page of pages) {
                const fileName =
                    page.fileName ?? (page.path === '/' ? 'index.html' : `${page.path.slice(1)}/index.html`);
                const depth = fileName.split('/').length - 1;
                const assetUrl = (fileName: string) =>
                    base === './' || base === '' ? `${'../'.repeat(depth)}${fileName}` : `${base}${fileName}`;

                this.emitFile({
                    type: 'asset',
                    fileName,
                    source: createIndexHtml(
                        assetUrl(entry.fileName),
                        page,
                        stylesheets.map((stylesheet) => assetUrl(stylesheet)),
                    ),
                });
            }
        },
        resolveId(id) {
            if (id === AURORA_CLIENT_ENTRY) return resolvedClientEntry;
        },
        load(id) {
            if (id === resolvedClientEntry) return createClientEntry(command === 'build');
        },
        configureServer(server) {
            server.middlewares.use(devPageMiddleware(server, base));
        },
        configurePreviewServer(server) {
            server.middlewares.use(
                previewPageMiddleware(
                    server,
                    base,
                    config.content.map(({ path }) => path),
                ),
            );
        },
    };
};
