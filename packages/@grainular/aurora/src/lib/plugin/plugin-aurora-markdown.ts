import rehypeShiki from '@shikijs/rehype';
import type { Plugin } from 'vite';
import { nordMarkdown } from 'vite-plugin-nord-md';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { auroraTheme } from '../markdown/aurora-shiki-theme';
import { codeBlockTransformer } from '../markdown/code-block-transformer';
import { rehypeHeadingIds } from '../markdown/rehype-heading-ids';
import { rehypeHeadingLinks } from '../markdown/rehype-heading-links';
import { remarkCodeGroups } from '../markdown/remark-code-groups';
import { AURORA_COMPONENT_PREFIX } from './constants';

export const pluginAuroraMarkdown = (config: ResolvedAuroraConfig): Plugin =>
    nordMarkdown({
        components: [
            ...['Note', 'Tip', 'Important', 'Warning', 'Caution', 'Details'].map((identifier) => ({
                identifier,
                importPath: '@grainular/aurora/runtime',
            })),
            ...(config.components ?? []).map(({ name }) => ({
                identifier: name,
                importPath: `${AURORA_COMPONENT_PREFIX}${encodeURIComponent(name)}`,
            })),
        ],
        remarkPlugins: [[remarkCodeGroups, {}]],
        rehypePlugins: [
            [rehypeHeadingIds, {}],
            [rehypeHeadingLinks, {}],
            [
                rehypeShiki,
                {
                    theme: auroraTheme,
                    colorsRendering: 'none',
                    defaultLanguage: 'text',
                    transformers: [codeBlockTransformer()],
                },
            ],
            ...(config.markdown?.plugins ?? []),
        ],
        transforms: [
            (code) => code.replace(/^:::[\t ]+([a-zA-Z0-9_-]+)/gm, ':::$1'),
            ...(config.markdown?.transforms ?? []),
        ],
    });
