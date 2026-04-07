import type { PluggableList } from 'unified';
import type { Plugin } from 'vite';
import { parseMarkdown } from './lib/parse-markdown';

export type ComponentDefinition = { identifier: string; importPath: string };
export type NodeData = { name: string; props: string; children: string };
type PluginOptions = {
    components: ComponentDefinition[];
    plugins?: PluggableList;
};
export const nordMarkdown = ({ components, plugins = [] }: PluginOptions): Plugin => {
    return {
        name: 'nord-markdown',
        enforce: 'pre',
        transform: async (code, id) => {
            if (!id.endsWith('.md')) return;
            const componentMap = new Map(components.map((c) => [c.identifier, c.importPath]));
            const nodes = new Map<string, NodeData>();
            return parseMarkdown(code, componentMap, nodes, plugins);
        },
    };
};
