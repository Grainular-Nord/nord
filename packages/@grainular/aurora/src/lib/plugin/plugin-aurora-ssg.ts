import type { Plugin } from 'vite';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { createComponentModule } from '../virtual/component-module';
import { createSsgEntry } from '../virtual/ssg-entry';
import { AURORA_COMPONENT_PREFIX, AURORA_CONFIG_ID, AURORA_SSG_ENTRY } from './constants';

export const pluginAuroraSsg = (config: ResolvedAuroraConfig): Plugin => {
    const resolvedConfigId = `\0${AURORA_CONFIG_ID}`;
    const resolvedSsgEntry = `\0${AURORA_SSG_ENTRY}`;
    const resolvedComponentPrefix = `\0${AURORA_COMPONENT_PREFIX}`;
    let base = '/';

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
        load(id) {
            if (id === resolvedConfigId) {
                return config.configFile
                    ? `export { default } from ${JSON.stringify(config.configFile)};`
                    : 'export default {};';
            }
            if (id === resolvedSsgEntry) return createSsgEntry(config, base);
            if (id.startsWith(resolvedComponentPrefix)) {
                return createComponentModule(decodeURIComponent(id.slice(resolvedComponentPrefix.length)));
            }
        },
    };
};
