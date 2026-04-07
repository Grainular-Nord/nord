import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { type PluggableList, unified } from 'unified';
import 'vfile-matter';
import { matter } from 'vfile-matter';
import type { NodeData } from '..';
import { createOutputFile } from './create-output-file';
import { remarkPluginComponents } from './remark-plugin-components';

export const parseMarkdown = async (
    code: string,
    components: Map<string, string>,
    nodes: Map<string, NodeData>,
    plugins: PluggableList,
) => {
    const processor = unified()
        .use(remarkParse)
        // Frontmatter
        .use(remarkFrontmatter, ['yaml'])
        .use(() => (_, file) => matter(file))

        // Custom directives
        .use(remarkDirective)
        .use(remarkPluginComponents(components, nodes, plugins))

        // Other plugins
        .use(remarkRehype)
        .use(plugins)
        .use(rehypeStringify);

    const { data, value } = await processor.process(code);
    const props = (data.matter ?? {}) as Record<PropertyKey, unknown>;

    return {
        code: createOutputFile(String(value), props, components, nodes),
        map: null,
    };
};
