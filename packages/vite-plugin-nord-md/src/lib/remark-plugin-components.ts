import type { Root } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import { type PluggableList, unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { NodeData } from '..';
import { escapeHtmlString } from './escape-html-string';

export function remarkPluginComponents(
    components: Map<string, string>,
    nodes: Map<string, NodeData>,
    plugins: PluggableList,
) {
    const processor = unified().use(remarkRehype).use(plugins).use(rehypeStringify);
    const parseAttributes = (attrs: Record<string, unknown>) => {
        return JSON.stringify(
            Object.fromEntries([
                ...Object.entries(attrs).map(([key, value]) => {
                    // Try to parse as number or boolean
                    if (value === 'true') return [key, true];
                    if (value === 'false') return [key, false];
                    const num = Number(value);
                    if (!Number.isNaN(num)) return [key, num];
                    return [key, value];
                }),
            ]),
        );
    };

    return () => async (tree: Root) => {
        const directives: ContainerDirective[] = [];
        visit(tree, 'containerDirective', (node) => {
            if (components.has(node.name)) directives.push(node);
        });

        // Process the deepest directives first so parent children already
        // contain stable markers for any nested components.
        for (const node of directives.reverse()) {
            const id = `nø-${crypto.randomUUID()}`;
            nodes.set(id, {
                name: node.name,
                props: parseAttributes(node.attributes ?? {}),
                children: escapeHtmlString(
                    processor.stringify(
                        await processor.run({
                            type: 'root',
                            children: node.children ?? [],
                        }),
                    ),
                ),
            });

            // Reset the node and replace it with the marker
            const marker = { type: 'text', value: `{{${id}}}`, children: [] };
            Object.assign(node, marker);
        }
    };
}
