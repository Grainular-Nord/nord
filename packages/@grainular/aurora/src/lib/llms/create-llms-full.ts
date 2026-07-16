import type { ResolvedAuroraConfig } from '../config/resolve-config';
import type { LlmsPage } from './llms-page';

export const createLlmsFull = (config: ResolvedAuroraConfig, pages: LlmsPage[]) => {
    const title = config.site?.title ?? 'Aurora';
    const description = config.site?.description ? `\n\n> ${config.site.description}` : '';
    const content = pages.map((page) => page.content).join('\n\n---\n\n');
    return `# ${title}${description}\n\n${content}\n`;
};
