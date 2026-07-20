import type { HastNode } from './hast-node';
import { visit } from './visit';

export const rehypeHeadingLinks = () => (tree: HastNode) => {
    visit(tree, (node) => {
        if (!node.tagName?.match(/^h([1-6])$/)) return;

        const id = node.properties?.id;
        if (typeof id !== 'string') return;

        const children = node.children ?? [];
        node.children = [
            {
                type: 'element',
                tagName: 'a',
                properties: {
                    className: ['aurora-heading-link'],
                    href: `#${id}`,
                },
                children,
            },
        ];
    });
};
