import type { Connect, Plugin, ViteDevServer } from 'vite';

type NordSSROptions = {
    indexHtml: string;
    server: {
        entry: string;
    };
};

// Middleware that handles the respective
// transformation of the index html on
// server request.

const createServerMiddleware = (options: NordSSROptions): Connect.NextHandleFunction => {
    return (req, res, next) => {};
};

export const nordSSR = (options: NordSSROptions): Plugin => {
    return {
        name: 'vite-plugin-nord-ssr',
        enforce: 'pre',

        configureServer: (server: ViteDevServer) => {
            return () => {
                server.middlewares.use(createServerMiddleware(options));
            };
        },
    };
};
