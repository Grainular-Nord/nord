import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer, type ModuleNode } from 'vite';
import type { AuroraConfig } from './config';
import { type ResolvedAuroraConfig, resolveConfig } from './resolve-config';

const collectStyles = (entry: ModuleNode | undefined) => {
    const styles = new Set<string>();
    const visited = new Set<ModuleNode>();

    const visit = (module: ModuleNode) => {
        if (visited.has(module)) return;
        visited.add(module);

        if (module.id?.endsWith('.css')) styles.add(module.id);
        for (const imported of module.importedModules) visit(imported);
    };

    if (entry) visit(entry);
    return [...styles];
};

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
        const styles = collectStyles(server.moduleGraph.getModuleById(configFile));
        return await resolveConfig(module.default ?? {}, resolvedRoot, configFile, styles);
    } finally {
        await server.close();
    }
};
