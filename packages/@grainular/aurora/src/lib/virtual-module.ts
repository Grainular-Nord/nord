import type { Connect, ViteDevServer } from 'vite';

// For now we create a simple template, that we can improve
// upon later. We will be able to add all kinds of meta data
// here, like title and description maybe.
const getIndexHtml = (entryId: string) => {
    return `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>Aurora</title>
        </head>
        <body>
            <div id="app"></div>
            <script type="module" src="/@id/${entryId}"></script>
        </body>
    </html>`;
};

export const virtualModule = (server: ViteDevServer, entryId: string): Connect.NextHandleFunction => {
    return async (req, res, next) => {
        const url = new URL(`http://${process.env.host ?? 'localhost'}${req.url}`);
        const { pathname } = url;

        if (pathname === '/') {
            try {
                const transformed = await server.transformIndexHtml(pathname, getIndexHtml(entryId));

                res.statusCode = 200;
                res.setHeader('content-type', 'text/html');
                return res.end(transformed);
            } catch (e: unknown) {
                next(e);
            }
        }

        return next();
    };
};
