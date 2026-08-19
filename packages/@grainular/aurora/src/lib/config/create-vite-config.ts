import { createLogger, type InlineConfig, type PluginOption } from 'vite';
import { pluginAuroraCore } from '../plugin/plugin-aurora-core';
import { pluginAuroraCss } from '../plugin/plugin-aurora-css';
import { pluginAuroraLinks } from '../plugin/plugin-aurora-links';
import { pluginAuroraLlms } from '../plugin/plugin-aurora-llms';
import { pluginAuroraMarkdown } from '../plugin/plugin-aurora-markdown';
import { pluginAuroraSearch } from '../plugin/plugin-aurora-search';
import { pluginAuroraSitemap } from '../plugin/plugin-aurora-sitemap';
import { pluginAuroraSsg } from '../plugin/plugin-aurora-ssg';
import type { ResolvedAuroraConfig } from './resolve-config';

const defined = <T extends object>(value: T | undefined): Partial<T> =>
    Object.fromEntries(Object.entries(value ?? {}).filter(([, entry]) => entry !== undefined)) as Partial<T>;

export const createViteConfig = (config: ResolvedAuroraConfig, overrides: InlineConfig = {}): InlineConfig => {
    const { plugins = [], ...vite } = config.vite;

    return {
        ...vite,
        ...overrides,
        appType: 'custom',
        build: { ...vite.build, ...defined(overrides.build) },
        configFile: false,
        customLogger: vite.customLogger ?? createLogger(vite.logLevel, { prefix: '[aurora]' }),
        preview: { ...vite.preview, ...defined(overrides.preview) },
        root: config.root,
        server: { ...vite.server, ...defined(overrides.server) },
        plugins: [
            ...(plugins as PluginOption[]),
            pluginAuroraMarkdown(config),
            pluginAuroraSsg(config),
            ...(config.llms ? [pluginAuroraSsg(config)] : []),
            pluginAuroraLlms(config),
            pluginAuroraCore(config),
            pluginAuroraLinks(),
            ...(config.search ? [pluginAuroraSearch()] : []),
            pluginAuroraSitemap(config),
            pluginAuroraCss(config),
        ],
    };
};
