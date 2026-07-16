import rehypeShiki from '@shikijs/rehype';
import type { Plugin } from 'vite';
import { nordMarkdown } from 'vite-plugin-nord-md';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { auroraDarkTheme, auroraLightTheme } from '../markdown/aurora-shiki-theme';
import { codeBlockTransformer } from '../markdown/code-block-transformer';
import { rehypeHeadingIds } from '../markdown/rehype-heading-ids';
import { rehypeHeadingLinks } from '../markdown/rehype-heading-links';
import { AURORA_COMPONENT_PREFIX } from './constants';

export const pluginAuroraMarkdown = (config: ResolvedAuroraConfig): Plugin => {
    const components: Parameters<typeof nordMarkdown>[0]['components'] = [
        ...['Note', 'Tip', 'Important', 'Warning', 'Caution'].map((identifier) => ({
            identifier,
            importPath: '@grainular/aurora/runtime',
        })),
        ...(config.components ?? []).map(({ name }) => ({
            identifier: name,
            importPath: `${AURORA_COMPONENT_PREFIX}${encodeURIComponent(name)}`,
        })),
    ];

    const plugins: NonNullable<Parameters<typeof nordMarkdown>[0]['plugins']> = [
        [rehypeHeadingIds, {}],
        [rehypeHeadingLinks, {}],
        [
            rehypeShiki,
            {
                themes: {
                    light: auroraLightTheme,
                    dark: auroraDarkTheme,
                },
                defaultColor: 'light-dark()',
                colorsRendering: 'none',
                defaultLanguage: 'text',
                transformers: [codeBlockTransformer()],
            },
        ],
        ...(config.markdown?.plugins ?? []),
    ];

    const transforms: NonNullable<Parameters<typeof nordMarkdown>[0]['transforms']> = [
        (code) => code.replace(/^:::[\t ]+([a-zA-Z0-9_-]+)/gm, ':::$1'),
        ...(config.markdown?.transforms ?? []),
    ];

    return nordMarkdown({
        components,
        plugins,
        transforms,
    });
};
