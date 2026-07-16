import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Connect, PreviewServer } from 'vite';
import { stripBasePath } from '../path/strip-base-path';

export const previewPageMiddleware = (
    server: PreviewServer,
    base: string,
    routes: string[],
): Connect.NextHandleFunction => {
    const notFoundFile = resolve(server.config.root, server.config.build.outDir, '404.html');

    return async (request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost');
        const requestPath = stripBasePath(url.pathname, base);
        const path = requestPath.length > 1 ? requestPath.replace(/\/$/, '') : requestPath;
        const isRoute = routes.includes(path);

        if (isRoute) {
            const prefix =
                requestPath === '/'
                    ? url.pathname.replace(/\/$/, '')
                    : url.pathname.slice(0, url.pathname.length - requestPath.length);
            url.pathname = `${prefix}${path === '/' ? '/index.html' : `${path}/index.html`}`;
            request.url = `${url.pathname}${url.search}`;
            return next();
        }

        if (!request.headers.accept?.includes('text/html')) return next();

        try {
            const html = await readFile(notFoundFile, 'utf8');
            response.statusCode = 404;
            response.setHeader('content-type', 'text/html; charset=utf-8');
            response.end(request.method === 'HEAD' ? undefined : html);
        } catch (error) {
            next(error);
        }
    };
};
