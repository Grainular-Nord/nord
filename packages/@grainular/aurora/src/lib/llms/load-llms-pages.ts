import { readFile } from 'node:fs/promises';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { readFrontmatterValue, stripFrontmatter } from './frontmatter';
import type { LlmsPage } from './llms-page';

export const loadLlmsPages = async (config: ResolvedAuroraConfig): Promise<LlmsPage[]> =>
    Promise.all(
        config.content.map(async (route) => {
            const markdown = await readFile(route.source, 'utf8');
            return {
                content: stripFrontmatter(markdown),
                description: readFrontmatterValue(markdown, 'description'),
                label: readFrontmatterValue(markdown, 'title') ?? route.path,
                path: route.path,
            };
        }),
    );
