import type { Plugin } from 'vite';
import auroraStylesheet from '../../themes/default';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { AURORA_CLIENT_ENTRY, AURORA_DEV_STYLESHEET, AURORA_STYLES_ID } from './constants';

export const pluginAuroraCss = (config: ResolvedAuroraConfig): Plugin => {
    let command: 'build' | 'serve' = 'serve';

    return {
        name: 'aurora-css',
        configResolved(vite) {
            command = vite.command;
        },
        resolveId(id) {
            const [path] = id.split('?');
            if (path !== AURORA_STYLES_ID) return;
            return `\0${AURORA_STYLES_ID}`;
        },
        load(id) {
            const [path] = id.split('?');
            if (path !== `\0${AURORA_STYLES_ID}`) return;
            return auroraStylesheet;
        },
        transform(source, id) {
            if (id !== `\0${AURORA_CLIENT_ENTRY}`) return;

            const styles = [...(command === 'build' ? [AURORA_STYLES_ID] : []), ...config.styles];
            const imports = styles.map((style) => `import ${JSON.stringify(style)};`).join('\n');
            return `${imports}\n${source}`;
        },
        configureServer(server) {
            server.middlewares.use(AURORA_DEV_STYLESHEET, (_request, response) => {
                response.statusCode = 200;
                response.setHeader('content-type', 'text/css; charset=utf-8');
                response.setHeader('cache-control', 'no-cache');
                response.end(auroraStylesheet);
            });
        },
    };
};
