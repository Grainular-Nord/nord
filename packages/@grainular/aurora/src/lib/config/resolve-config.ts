import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { UserConfig } from 'vite';
import type { AuroraConfig, AuroraNavigationGroup, AuroraNavigationItem, AuroraNavigationRoute } from './config';

export type ResolvedNavigationRoute = Omit<AuroraNavigationRoute, 'children'> & {
    source: string;
    children: ResolvedNavigationItem[];
};

export type ResolvedNavigationItem =
    | ResolvedNavigationRoute
    | (Omit<AuroraNavigationGroup, 'children'> & { children: ResolvedNavigationItem[] });

export type ResolvedAuroraConfig = Omit<AuroraConfig, 'navigation' | 'vite'> & {
    root: string;
    configFile?: string;
    /** Flattened routes consumed by build features. */
    navigation: ResolvedNavigationRoute[];
    /** Preserved navigation hierarchy consumed by the runtime sidebar. */
    navigationTree: ResolvedNavigationItem[];
    /** Optional 404.md discovered beside the root route's Markdown source. */
    notFoundSource?: string;
    vite: UserConfig;
};

const resolveNavigation = (config: AuroraConfig, root: string) => {
    const navigation = config.navigation ?? [{ source: 'index.md', path: '/', label: 'Home' }];
    const routes: ResolvedNavigationRoute[] = [];

    const resolveItem = (item: AuroraNavigationItem): ResolvedNavigationItem => {
        if (typeof item.source !== 'string') {
            return { ...item, children: item.children.map(resolveItem) };
        }

        const normalized = `/${item.path}`.replace(/\/{2,}/g, '/');
        const path = normalized.length > 1 ? normalized.replace(/\/$/, '') : normalized;
        const route: ResolvedNavigationRoute = { ...item, path, source: resolve(root, item.source), children: [] };
        routes.push(route);
        route.children = (item.children ?? []).map(resolveItem);
        return route;
    };

    const navigationTree = navigation.map(resolveItem);
    return { navigation: routes, navigationTree };
};

export const resolveConfig = (
    config: AuroraConfig = {},
    root = process.cwd(),
    configFile?: string,
): ResolvedAuroraConfig => {
    const resolvedRoot = resolve(root);
    const navigation = resolveNavigation(config, resolvedRoot);
    const rootSource = navigation.navigation.find(({ path }) => path === '/')?.source;
    if (!rootSource) throw new Error('Could not determine root.');
    const notFoundSource = resolve(dirname(rootSource), '404.md');

    return {
        ...config,
        root: resolvedRoot,
        configFile,
        ...navigation,
        ...(existsSync(notFoundSource) ? { notFoundSource } : {}),
        vite: config.vite ?? {},
    };
};
