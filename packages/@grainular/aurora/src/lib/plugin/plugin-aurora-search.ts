import type { Plugin } from 'vite';
import type { AuroraStaticPage } from '../config/config';
import { extractSearchEntries } from '../search/extract-search-entries';
import { AURORA_SEARCH_FILE, AURORA_SSG_ENTRY } from './constants';
import { generatedHtmlPages } from './generated-html-pages';

export const pluginAuroraSearch = (): Plugin => {
    return {
        name: 'aurora-search',
        generateBundle: {
            order: 'post',
            handler(_options, bundle) {
                const entries = generatedHtmlPages(bundle).flatMap(({ path, source }) =>
                    extractSearchEntries(path, source),
                );

                this.emitFile({ type: 'asset', fileName: AURORA_SEARCH_FILE, source: JSON.stringify(entries) });
            },
        },
        configureServer(server) {
            server.middlewares.use(`/${AURORA_SEARCH_FILE}`, async (_request, response, next) => {
                try {
                    const { pages } = (await server.ssrLoadModule(AURORA_SSG_ENTRY)) as { pages: AuroraStaticPage[] };
                    const entries = pages
                        .filter((page) => page.status !== 404)
                        .flatMap((page) => extractSearchEntries(page.path, page.markup));
                    response.statusCode = 200;
                    response.setHeader('content-type', 'application/json; charset=utf-8');
                    response.setHeader('cache-control', 'no-cache');
                    response.end(JSON.stringify(entries));
                } catch (error) {
                    next(error);
                }
            });
        },
    };
};
