import type { Connect, Plugin } from 'vite';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { createLlmsFull } from '../llms/create-llms-full';
import { createLlmsIndex } from '../llms/create-llms-index';
import { loadLlmsPages } from '../llms/load-llms-pages';

const LLMS_INDEX = 'llms.txt';
const LLMS_FULL = 'llms-full.txt';

const llmsMiddleware = (config: ResolvedAuroraConfig, base: () => string): Connect.NextHandleFunction => {
    return async (request, response, next) => {
        const path = new URL(request.url ?? '/', 'http://localhost').pathname;
        if (path !== `/${LLMS_INDEX}` && path !== `/${LLMS_FULL}`) return next();

        try {
            const pages = await loadLlmsPages(config);
            const output =
                path === `/${LLMS_INDEX}` ? createLlmsIndex(config, pages, base()) : createLlmsFull(config, pages);
            response.statusCode = 200;
            response.setHeader('content-type', 'text/plain; charset=utf-8');
            response.setHeader('cache-control', 'no-cache');
            response.end(output);
        } catch (error) {
            next(error);
        }
    };
};

export const pluginAuroraLlms = (config: ResolvedAuroraConfig): Plugin => {
    let base = '/';

    return {
        name: 'aurora-llms',
        configResolved(vite) {
            base = vite.base;
        },
        async generateBundle() {
            const pages = await loadLlmsPages(config);
            this.emitFile({ type: 'asset', fileName: LLMS_INDEX, source: createLlmsIndex(config, pages, base) });
            this.emitFile({ type: 'asset', fileName: LLMS_FULL, source: createLlmsFull(config, pages) });
        },
        configureServer(server) {
            server.watcher.add(config.content.map((route) => route.source));
            server.middlewares.use(llmsMiddleware(config, () => base));
        },
    };
};
