import type { Connect, ViteDevServer } from 'vite';
import type { AuroraStaticPage } from '../config/config';
import { stripBasePath } from '../path/strip-base-path';
import { AURORA_CLIENT_ENTRY, AURORA_DEV_STYLESHEET, AURORA_SSG_ENTRY } from './constants';
import { createIndexHtml } from './create-index-html';

export const devPageMiddleware = (server: ViteDevServer, base: string): Connect.NextHandleFunction => {
    return async (request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost');
        const routePath = stripBasePath(url.pathname, base);
        const normalizedPath = routePath.length > 1 ? routePath.replace(/\/$/, '') : routePath;

        try {
            const { pages } = (await server.ssrLoadModule(AURORA_SSG_ENTRY)) as { pages: AuroraStaticPage[] };
            const exactPage = pages.find((candidate) => candidate.path === normalizedPath);
            const acceptsHtml = request.headers.accept?.includes('text/html') ?? false;
            const page = exactPage ?? (acceptsHtml ? pages.find((candidate) => candidate.status === 404) : undefined);
            if (!page) return next();

            const html = createIndexHtml(`/@id/${AURORA_CLIENT_ENTRY}`, page, [AURORA_DEV_STYLESHEET]);
            const transformed = await server.transformIndexHtml(url.pathname, html);
            response.statusCode = page.status ?? 200;
            response.setHeader('content-type', 'text/html; charset=utf-8');
            response.end(request.method === 'HEAD' ? undefined : transformed);
        } catch (error) {
            next(error);
        }
    };
};
