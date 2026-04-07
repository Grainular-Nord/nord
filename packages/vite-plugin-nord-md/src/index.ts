import type { PluggableList } from 'unified';
import type { Plugin } from 'vite';
import { parseMarkdown } from './lib/parse-markdown';

export type ComponentDefinition = { identifier: string; importPath: string };
export type NodeData = { name: string; props: string; children: string };
type PluginOptions = {
    components: ComponentDefinition[];
    plugins?: PluggableList;
    transform?: ((code: string, id: string) => string | Promise<string>)[];
};
export const nordMarkdown = ({ components, plugins = [], transform = [] }: PluginOptions): Plugin => {
    return {
        name: 'nord-markdown',
        enforce: 'pre',
        transform: async (code, id) => {
            if (!id.endsWith('.md')) return;
            const componentMap = new Map(components.map((c) => [c.identifier, c.importPath]));
            const nodes = new Map<string, NodeData>();

            // For of because of async transforms
            let transformed = code;
            for (const fn of transform) {
                transformed = await fn(transformed, id);
            }

            return parseMarkdown(transformed, componentMap, nodes, plugins);
        },
    };
};
