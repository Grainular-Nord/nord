import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { AURORA_CONFIG_ID } from '../plugin/constants';

const contentImports = (config: ResolvedAuroraConfig) =>
    config.navigation
        .map(
            ({ source }, index) =>
                `import { meta as meta${index}, content as content${index} } from ${JSON.stringify(source)};`,
        )
        .join('\n');

const pageRecords = (config: ResolvedAuroraConfig) =>
    config.navigation
        .map((_route, index) => `{ route: navigationItems[${index}], meta: meta${index}, content: content${index} }`)
        .join(',\n');

const notFoundImport = (config: ResolvedAuroraConfig) =>
    config.notFoundSource
        ? `import { meta as notFoundMeta, content as notFoundContent } from ${JSON.stringify(config.notFoundSource)};`
        : 'const notFoundMeta = {}; const notFoundContent = null;';

const runtimeNavigation = (config: ResolvedAuroraConfig) => {
    const serialize = (item: (typeof config.navigationTree)[number]): Record<string, unknown> => ({
        label: item.label,
        ...('path' in item && item.path ? { path: item.path } : {}),
        children: item.children.map(serialize),
    });

    return config.navigationTree.map(serialize);
};

export const createSsgEntry = (config: ResolvedAuroraConfig, base: string) => {
    const navigation = config.navigation.map(({ path, label, meta }) => ({ path, label, meta }));
    const navigationTree = runtimeNavigation(config);

    return `
        import { renderToString } from "@grainular/nord";
        import { $pageMeta, App, builtInLayouts, context, DefaultNotFoundContent, NotFound } from "@grainular/aurora/runtime";
        import auroraConfig from ${JSON.stringify(AURORA_CONFIG_ID)};
        ${contentImports(config)}
        ${notFoundImport(config)}

        const site = auroraConfig.site ?? {};
        const pageDefaults = auroraConfig.page?.meta ?? {};
        const buildBase = ${JSON.stringify(base)};
        const navigationItems = ${JSON.stringify(navigation)};
        const navigationTree = ${JSON.stringify(navigationTree)};
        const sourcePages = [${pageRecords(config)}];
        const layoutDefinitions = [...builtInLayouts, ...(auroraConfig.layouts ?? [])];
        const layouts = new Map(await Promise.all(
            layoutDefinitions.map(async (definition) => {
                const { default: layout } = await definition.layout();
                return [definition.name, layout];
            })
        ));

        const routeHref = (targetPath, currentPath) => {
            if (buildBase === './' || buildBase === '') {
                const depth = currentPath === '/' ? 0 : currentPath.slice(1).split('/').length;
                const prefix = '../'.repeat(depth);
                const target = targetPath === '/' ? '' : targetPath.slice(1);
                return prefix + target || './';
            }

            const prefix = buildBase.endsWith('/') ? buildBase : buildBase + '/';
            return targetPath === '/' ? prefix : prefix + targetPath.slice(1);
        };

        const resolveNavigation = (items, currentPath, linkPath) => items.map((item) => {
            const children = resolveNavigation(item.children, currentPath, linkPath);
            const active = item.path === currentPath;
            return {
                label: item.label,
                ...(item.path ? { path: routeHref(item.path, linkPath) } : {}),
                active,
                children
            };
        });

        const renderPage = ({ path, linkPath = path, meta, content, fileName, status }) => {
            const routes = resolveNavigation(navigationTree, path, linkPath);
            const siteConfig = { ...site, base: routeHref('/', linkPath), routes };
            context.set(siteConfig);
            const title = [meta.title, siteConfig.title].filter(Boolean).join(" | ");
            const resolvedMeta = {
                ...meta,
                title,
                description: meta.description ?? siteConfig.description
            };

            return {
                path,
                ...(fileName ? { fileName } : {}),
                markup: renderToString(() => App({ meta, content, layouts })),
                head: renderToString(() => $pageMeta(resolvedMeta)),
                language: resolvedMeta.language ?? 'en',
                ...(status ? { status } : {})
            };
        };

        const contentPages = sourcePages.map(({ route, meta: markdownMeta, content }) => renderPage({
            path: route.path,
            meta: { ...pageDefaults, ...(markdownMeta ?? {}), ...(route.meta ?? {}) },
            content
        }));

        const notFoundPath = '/404';
        const notFound = renderPage({
            path: notFoundPath,
            linkPath: '/',
            fileName: '404.html',
            status: 404,
            meta: {
                ...pageDefaults,
                title: 'Page not found',
                description: 'The requested page could not be found.',
                layout: 'page',
                robots: 'noindex',
                ...(notFoundMeta ?? {})
            },
            content: NotFound({
                home: routeHref('/', '/'),
                children: notFoundContent ?? DefaultNotFoundContent()
            })
        });

        export const pages = [...contentPages, notFound];
    `;
};
