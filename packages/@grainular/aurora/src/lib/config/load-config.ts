import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer, type Plugin } from 'vite';
import type { AuroraConfig } from './config';
import { type ResolvedAuroraConfig, resolveConfig } from './resolve-config';

const CONFIG_FILE = 'aurora.config.ts';
const CSS_STUB_PREFIX = '\0aurora-config-css:';

const configCssStub = (): Plugin => ({
    name: 'aurora-config-css-stub',
    enforce: 'pre',
    resolveId(id) {
        if (id.split('?')[0]?.endsWith('.css')) return `${CSS_STUB_PREFIX}${id}`;
    },
    load(id) {
        if (id.startsWith(CSS_STUB_PREFIX)) return 'export default undefined;';
    },
});

export const loadConfig = async (root = process.cwd()): Promise<ResolvedAuroraConfig> => {
    const resolvedRoot = resolve(root);
    const configFile = resolve(resolvedRoot, CONFIG_FILE);
    if (!existsSync(configFile)) return resolveConfig({}, resolvedRoot);

    const server = await createServer({
        appType: 'custom',
        configFile: false,
        logLevel: 'silent',
        plugins: [configCssStub()],
        root: resolvedRoot,
        server: { middlewareMode: true },
    });

    try {
        const module = (await server.ssrLoadModule(configFile)) as { default?: AuroraConfig };
        return resolveConfig(module.default ?? {}, resolvedRoot, configFile);
    } finally {
        await server.close();
    }
};
