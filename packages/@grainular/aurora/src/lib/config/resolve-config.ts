import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { UserConfig } from 'vite';
import type { AuroraConfig, AuroraNavigationGroup, AuroraNavigationItem, AuroraNavigationRoute } from './config';

export type ResolvedNavigationRoute = Omit<AuroraNavigationRoute, 'children'> & {
    source: string;
    children: ResolvedNavigationItem[];
};

export type ResolvedNavigationGroup = Omit<AuroraNavigationGroup, 'children'> & {
    children: ResolvedNavigationItem[];
};

export type ResolvedNavigationItem = ResolvedNavigationRoute | ResolvedNavigationGroup;

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

export const normalizeRoutePath = (path: string) => {
    if (path.includes('?') || path.includes('#')) {
        throw new Error(`Aurora route paths cannot contain a query or hash: ${path}`);
    }

    const normalized = `/${path}`.replace(/\/{2,}/g, '/');
    return normalized.length > 1 ? normalized.replace(/\/$/, '') : normalized;
};

const resolveNavigation = (config: AuroraConfig, root: string) => {
    const navigation = config.navigation ?? [{ source: 'index.md', path: '/', label: 'Home' }];
    const paths = new Set<string>();
    const routes: ResolvedNavigationRoute[] = [];

    if (navigation.length === 0) throw new Error('Aurora requires at least one navigation item.');

    const resolveItem = (item: AuroraNavigationItem): ResolvedNavigationItem => {
        if (!item.label.trim()) throw new Error('Aurora navigation labels cannot be empty.');

        if (typeof item.source !== 'string') {
            const children = item.children.map(resolveItem);
            if (children.length === 0) throw new Error(`Aurora navigation group "${item.label}" cannot be empty.`);
            return { ...item, children };
        }

        const path = normalizeRoutePath(item.path);
        if (paths.has(path)) throw new Error(`Aurora route paths must be unique: ${path}`);
        paths.add(path);

        const route: ResolvedNavigationRoute = { ...item, path, source: resolve(root, item.source), children: [] };
        routes.push(route);
        route.children = (item.children ?? []).map(resolveItem);
        return route;
    };

    const navigationTree = navigation.map(resolveItem);
    if (routes.length === 0) throw new Error('Aurora navigation requires at least one Markdown-backed route.');
    return { navigation: routes, navigationTree };
};

const validateComponents = (config: AuroraConfig) => {
    const names = new Set(['Note', 'Tip', 'Important', 'Warning', 'Caution']);
    for (const definition of config.components ?? []) {
        if (!/^[A-Za-z_$][\w$]*$/.test(definition.name)) {
            throw new Error(`Aurora component names must be valid JavaScript identifiers: ${definition.name}`);
        }
        if (names.has(definition.name)) throw new Error(`Aurora component names must be unique: ${definition.name}`);
        names.add(definition.name);
    }
};

const validateLayouts = (config: AuroraConfig) => {
    const names = new Set<string>();
    for (const definition of config.layouts ?? []) {
        if (!definition.name.trim()) throw new Error('Aurora layout names cannot be empty.');
        if (names.has(definition.name)) throw new Error(`Aurora layout names must be unique: ${definition.name}`);
        names.add(definition.name);
    }
};

export const resolveConfig = (
    config: AuroraConfig = {},
    root = process.cwd(),
    configFile?: string,
): ResolvedAuroraConfig => {
    const resolvedRoot = resolve(root);
    validateComponents(config);
    validateLayouts(config);
    const navigation = resolveNavigation(config, resolvedRoot);
    const rootSource =
        navigation.navigation.find(({ path }) => path === '/')?.source ?? navigation.navigation[0].source;
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
