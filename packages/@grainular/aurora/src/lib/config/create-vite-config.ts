import { createLogger, type InlineConfig, type PluginOption } from 'vite';
import { plugin } from '../plugin/plugin';
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
        plugins: [...(plugins as PluginOption[]), ...plugin(config)],
    };
};
