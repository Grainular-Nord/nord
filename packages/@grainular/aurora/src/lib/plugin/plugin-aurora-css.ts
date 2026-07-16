import type { Plugin } from 'vite';
import auroraStylesheet from '../../themes/default';
import { AURORA_DEV_STYLESHEET, AURORA_STYLES_ID } from './constants';

// Aurora's stylesheet is always an ordinary CSS entry during production
// builds. CSS imported by aurora.config.ts follows it in the same graph.
export const pluginAuroraCss = (): Plugin => ({
    name: 'aurora-css',
    resolveId: (id) => {
        const [path] = id.split('?');
        if (path !== AURORA_STYLES_ID) return;
        return `\0${AURORA_STYLES_ID}`;
    },
    load: (id) => {
        const [path] = id.split('?');
        if (path !== `\0${AURORA_STYLES_ID}`) return;
        return auroraStylesheet;
    },
    configureServer(server) {
        server.middlewares.use(AURORA_DEV_STYLESHEET, (_request, response) => {
            response.statusCode = 200;
            response.setHeader('content-type', 'text/css; charset=utf-8');
            response.setHeader('cache-control', 'no-cache');
            response.end(auroraStylesheet);
        });
    },
});
