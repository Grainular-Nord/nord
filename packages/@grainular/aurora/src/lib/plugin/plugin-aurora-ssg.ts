import { existsSync } from 'node:fs';
import { dirname, matchesGlob, relative, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { type ResolvedAuroraConfig, resolveContent } from '../config/resolve-config';
import { createComponentModule } from '../virtual/component-module';
import { createSsgEntry } from '../virtual/ssg-entry';
import { AURORA_COMPONENT_PREFIX, AURORA_CONFIG_ID, AURORA_SSG_ENTRY } from './constants';

export const pluginAuroraSsg = (config: ResolvedAuroraConfig): Plugin => {
    const resolvedConfigId = `\0${AURORA_CONFIG_ID}`;
    const resolvedSsgEntry = `\0${AURORA_SSG_ENTRY}`;
    const resolvedComponentPrefix = `\0${AURORA_COMPONENT_PREFIX}`;
    let base = '/';

    const refreshContent = async () => {
        config.content = await resolveContent(config.contentPatterns, config.root);
        const rootSource = config.content.find(({ path }) => path === '/')?.source;
        if (!rootSource) throw new Error('Could not determine root.');

        const notFoundSource = resolve(dirname(rootSource), '404.md');
        if (existsSync(notFoundSource)) config.notFoundSource = notFoundSource;
        else delete config.notFoundSource;
    };

    return {
        name: 'aurora-ssg',
        configResolved(vite) {
            base = vite.base;
        },
        resolveId(id) {
            if (id === AURORA_CONFIG_ID) return resolvedConfigId;
            if (id === AURORA_SSG_ENTRY) return resolvedSsgEntry;
            if (id.startsWith(AURORA_COMPONENT_PREFIX)) {
                return `${resolvedComponentPrefix}${id.slice(AURORA_COMPONENT_PREFIX.length)}`;
            }
        },
        async load(id) {
            if (id === resolvedConfigId) {
                return config.configFile
                    ? `export { default } from ${JSON.stringify(config.configFile)};`
                    : 'export default {};';
            }
            if (id === resolvedSsgEntry) {
                await refreshContent();
                return createSsgEntry(config, base);
            }
            if (id.startsWith(resolvedComponentPrefix)) {
                return createComponentModule(decodeURIComponent(id.slice(resolvedComponentPrefix.length)));
            }
        },
        configureServer(server) {
            const reload = (file: string) => {
                const path = relative(config.root, file).replaceAll('\\', '/');
                if (!config.contentPatterns.some((pattern) => matchesGlob(path, pattern))) return;

                const module = server.moduleGraph.getModuleById(resolvedSsgEntry);
                if (module) server.moduleGraph.invalidateModule(module);
                server.ws.send({ type: 'full-reload' });
            };

            server.watcher.on('add', reload);
            server.watcher.on('unlink', reload);
        },
    };
};
