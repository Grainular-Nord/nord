import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import type { AuroraConfig } from './config';
import { type ResolvedAuroraConfig, resolveConfig } from './resolve-config';

export const loadConfig = async (root = process.cwd()): Promise<ResolvedAuroraConfig> => {
    const resolvedRoot = resolve(root);
    const configFile = resolve(resolvedRoot, 'aurora.config.ts');
    if (!existsSync(configFile)) return resolveConfig({}, resolvedRoot);

    const server = await createServer({
        appType: 'custom',
        configFile: false,
        logLevel: 'silent',
        root: resolvedRoot,
        server: { middlewareMode: true },
    });

    try {
        const module = (await server.ssrLoadModule(configFile)) as { default?: AuroraConfig };
        return await resolveConfig(module.default ?? {}, resolvedRoot, configFile);
    } finally {
        await server.close();
    }
};
