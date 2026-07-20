import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
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
    remarkPlugins: PluggableList,
    rehypePlugins: PluggableList,
) => {
    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        // Frontmatter
        .use(remarkFrontmatter, ['yaml'])
        .use(() => (_, file) => matter(file))

        // Custom directives
        .use(remarkDirective)
        .use(remarkPlugins)
        .use(remarkPluginComponents(components, nodes, rehypePlugins))

        // Other plugins
        .use(remarkRehype)
        .use(rehypePlugins)
        .use(rehypeStringify);

    const { data, value } = await processor.process(code);
    const props = (data.matter ?? {}) as Record<PropertyKey, unknown>;

    return {
        code: createOutputFile(String(value), props, components, nodes),
        map: null,
    };
};
