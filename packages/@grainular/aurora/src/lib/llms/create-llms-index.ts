import type { ResolvedAuroraConfig } from '../config/resolve-config';
import type { LlmsPage } from './llms-page';

const routeHref = (path: string, base: string) => {
    const prefix = base === './' || base === '' ? './' : base.endsWith('/') ? base : `${base}/`;
    return path === '/' ? prefix : `${prefix}${path.slice(1)}`;
};

export const createLlmsIndex = (config: ResolvedAuroraConfig, pages: LlmsPage[], base: string) => {
    const title = config.site?.title ?? 'Aurora';
    const description = config.site?.description ? `\n\n> ${config.site.description}` : '';
    const links = pages
        .map((page) => {
            const detail = page.description ? `: ${page.description}` : '';
            return `- [${page.label}](${routeHref(page.path, base)})${detail}`;
        })
        .join('\n');

    return `# ${title}${description}\n\n## Documentation\n\n${links}\n`;
};
