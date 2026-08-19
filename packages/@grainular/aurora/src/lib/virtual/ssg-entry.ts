import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { AURORA_CONFIG_ID } from '../plugin/constants';

const contentImports = (config: ResolvedAuroraConfig) =>
    config.content
        .map(
            ({ source }, index) =>
                `import { meta as meta${index}, content as content${index} } from ${JSON.stringify(source)};`,
        )
        .join('\n');

const sourcePages = (config: ResolvedAuroraConfig) =>
    config.content
        .map(({ path }, index) => `{ path: ${JSON.stringify(path)}, meta: meta${index}, content: content${index} }`)
        .join(',\n');

const notFoundImport = (config: ResolvedAuroraConfig) =>
    config.notFoundSource
        ? `import { meta as notFoundMeta, content as notFoundContent } from ${JSON.stringify(config.notFoundSource)};`
        : 'const notFoundMeta = {}; const notFoundContent = null;';

export const createSsgEntry = (config: ResolvedAuroraConfig, base: string) => {
    return `
        import { renderToString } from "@grainular/nord";
        import { $pageMeta, App, builtInLayouts, context, createSsgRuntime, DefaultNotFoundContent, NotFound, parseConfig, renderComponentHost } from "@grainular/aurora/runtime";
        import auroraConfig from ${JSON.stringify(AURORA_CONFIG_ID)};
        ${contentImports(config)}
        ${notFoundImport(config)}

        const { navigation, page, search, site } = parseConfig(auroraConfig);
        const runtime = createSsgRuntime({ navigation, search, site }, ${JSON.stringify(base)});
        const generatedAt = new Date().toISOString();
        const sourcePages = [${sourcePages(config)}];

        // A slot is resolved once, like a layout, then wrapped as a host so
        // \`client: true\` slots hydrate through the same mechanism as any
        // other component. \`namespace\` keeps DOM identifiers unique across
        // layouts that reuse the same slot name (e.g. two \`sidebar\`s).
        const resolveSlots = async (definitions, namespace) => Object.fromEntries(
            await Promise.all(Object.entries(definitions ?? {}).map(async ([key, { client, host, component }]) => {
                const { default: render } = await component();
                const name = namespace + ':' + key;
                return [key, (props) => renderComponentHost({ name, client, host }, render, props)];
            }))
        );

        const layoutDefinitions = [...builtInLayouts, ...(auroraConfig.layouts ?? [])];
        const layouts = new Map(await Promise.all(
            layoutDefinitions.map(async (definition) => {
                const { default: layout } = await definition.layout();
                const slots = await resolveSlots(definition.slots, definition.name);
                return [definition.name, (props) => layout({ ...props, slots })];
            })
        ));
        const shellSlots = await resolveSlots(auroraConfig.slots, 'app');

        const renderPage = ({ path, linkPath = path, meta, content, fileName, status }) => {
            const lastUpdated = meta.lastUpdated === true ? generatedAt : undefined;
            const siteConfig = runtime.resolveSiteConfig(path, linkPath);
            context.set(siteConfig);
            const title = [meta.title, siteConfig.title].filter(Boolean).join(" | ");
            const resolvedMeta = {
                ...meta,
                title,
                description: meta.description ?? siteConfig.description
            };
            const social = {
                siteName: siteConfig.title,
                url: runtime.deploymentRoot
                    ? new URL(path === '/' ? '' : path.slice(1), runtime.deploymentRoot).href
                    : undefined,
                image: siteConfig.image
                    ? runtime.deploymentRoot
                        ? new URL(siteConfig.image.replace(/^\\//, ''), runtime.deploymentRoot).href
                        : siteConfig.image
                    : undefined
            };

            return {
                path,
                ...(fileName ? { fileName } : {}),
                markup: renderToString(() => App({
                    meta,
                    content,
                    lastUpdated,
                    layouts,
                    slots: shellSlots
                })),
                head: renderToString(() => $pageMeta({ ...resolvedMeta, ...page }, social)),
                language: page.language ?? 'en',
                ...(status ? { status } : {})
            };
        };

        const contentPages = sourcePages.map(({ path, meta, content }) => renderPage({
            path,
            meta,
            content
        }));

        const notFoundPath = '/404';
        const notFound = renderPage({
            path: notFoundPath,
            linkPath: '/',
            fileName: '404.html',
            status: 404,
            meta: {
                title: 'Page not found',
                description: 'The requested page could not be found.',
                layout: 'page',
                robots: 'noindex',
                ...(notFoundMeta ?? {})
            },
            content: NotFound({
                home: runtime.routeHref('/', '/'),
                children: notFoundContent ?? DefaultNotFoundContent()
            })
        });

        export const pages = [...contentPages, notFound];
    `;
};
