import { createServer } from 'vite';
import type { AuroraStaticPage } from '../config/config';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { AURORA_SSG_ENTRY } from '../plugin/constants';
import { pluginAuroraMarkdown } from '../plugin/plugin-aurora-markdown';
import { pluginAuroraSsg } from '../plugin/plugin-aurora-ssg';

export const renderStaticPages = async (config: ResolvedAuroraConfig, base: string) => {
    const server = await createServer({
        appType: 'custom',
        base,
        configFile: false,
        logLevel: 'silent',
        plugins: [pluginAuroraMarkdown(config), pluginAuroraSsg(config)],
        root: config.root,
        server: { middlewareMode: true },
    });

    try {
        const rendered = (await server.ssrLoadModule(AURORA_SSG_ENTRY)) as { pages: AuroraStaticPage[] };
        return rendered.pages;
    } finally {
        await server.close();
    }
};
