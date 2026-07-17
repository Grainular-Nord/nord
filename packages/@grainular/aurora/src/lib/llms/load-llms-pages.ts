import { readFile } from 'node:fs/promises';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { readFrontmatterValue, stripFrontmatter } from './frontmatter';
import type { LlmsPage } from './llms-page';

export const loadLlmsPages = async (config: ResolvedAuroraConfig): Promise<LlmsPage[]> => {
    const pages = await Promise.all(
        config.content.map(async (route) => {
            const markdown = await readFile(route.source, 'utf8');
            return {
                content: stripFrontmatter(markdown),
                description: readFrontmatterValue(markdown, 'description'),
                include: readFrontmatterValue(markdown, 'llms') !== 'false',
                label: readFrontmatterValue(markdown, 'title') ?? route.path,
                path: route.path,
            };
        }),
    );

    const order = new Map<string, number>();
    const visit = (items: ResolvedAuroraConfig['navigationTree']) => {
        for (const item of items) {
            if (item.path) order.set(item.path, order.size);
            visit(item.children);
        }
    };

    visit(config.navigationTree);

    return pages
        .filter(({ include }) => include)
        .sort((left, right) => (order.get(left.path) ?? Infinity) - (order.get(right.path) ?? Infinity))
        .map(({ include: _, ...page }) => page);
};
