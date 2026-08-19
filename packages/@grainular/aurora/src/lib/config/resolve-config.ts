import { existsSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { basename, dirname, relative, resolve } from 'node:path';
import type { UserConfig } from 'vite';
import { normalizeRoutePath } from '../path/normalize-route-path';
import type { AuroraConfig, AuroraNavigationItem } from './config';

export type ResolvedContentRoute = {
    source: string;
    path: string;
};

export type ResolvedNavigationItem = Omit<AuroraNavigationItem, 'children'> & {
    children: ResolvedNavigationItem[];
};

export type ResolvedAuroraConfig = Omit<AuroraConfig, 'content' | 'navigation' | 'vite' | 'search'> & {
    root: string;
    configFile?: string;
    contentPatterns: string[];
    content: ResolvedContentRoute[];
    navigationTree: ResolvedNavigationItem[];
    notFoundSource?: string;
    vite: UserConfig;
    search: boolean;
};

const patternRoot = (root: string, pattern: string) => {
    const wildcard = pattern.search(/[*?[\]{}()]/);
    if (wildcard < 0) return resolve(root, dirname(pattern));
    const prefix = pattern.slice(0, wildcard);
    return resolve(root, prefix.endsWith('/') ? prefix : dirname(prefix));
};

const commonRoot = (paths: string[]) => {
    let root = paths[0] ?? '';
    while (paths.some((path) => relative(root, path).startsWith('..'))) root = dirname(root);
    return root;
};

export const resolveContent = async (patterns: string[], root: string) => {
    const contentRoot = commonRoot(patterns.map((pattern) => patternRoot(root, pattern)));
    const routes = new Map<string, ResolvedContentRoute>();

    for await (const file of glob(patterns, { cwd: root })) {
        const source = resolve(root, file);
        if (basename(source) === '404.md') continue;

        const name = relative(contentRoot, source).replaceAll('\\', '/').replace(/\.md$/, '');
        const route = name === 'index' ? '/' : normalizeRoutePath(name.replace(/\/index$/, ''));
        routes.set(route, { source, path: route });
    }

    return [...routes.values()].sort(({ path: left }, { path: right }) => {
        if (left === '/') return -1;
        if (right === '/') return 1;
        return left.localeCompare(right);
    });
};

const resolveNavigation = (items: AuroraNavigationItem[] = []): ResolvedNavigationItem[] =>
    items.map((item) => ({
        ...item,
        ...('path' in item ? { path: normalizeRoutePath(item.path!) } : {}),
        children: resolveNavigation(item.children ?? []),
    }));

export const resolveConfig = async (
    config: AuroraConfig = {},
    root = process.cwd(),
    configFile?: string,
): Promise<ResolvedAuroraConfig> => {
    const resolvedRoot = resolve(root);
    const contentPatterns = [config.content ?? 'index.md'].flat();
    const content = await resolveContent(contentPatterns, resolvedRoot);
    const rootSource = content.find(({ path }) => path === '/')?.source;
    if (!rootSource) throw new Error('Could not determine root.');
    const notFoundSource = resolve(dirname(rootSource), '404.md');

    return {
        ...config,
        root: resolvedRoot,
        configFile,
        contentPatterns,
        content,
        navigationTree: resolveNavigation(config.navigation),
        ...(existsSync(notFoundSource) ? { notFoundSource } : {}),
        vite: config.vite ?? {},
        search: config.search ?? false,
        llms: config.llms ?? true,
    };
};
