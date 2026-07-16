import { slugify } from '../utils/slugify';
import { extractNodeText } from './extract-node-text';
import type { HastNode } from './hast-node';
import { visit } from './visit';

export const rehypeHeadingIds = () => (tree: HastNode) => {
    const identifiers = new Set<string>();

    visit(tree, (node) => {
        if (!node.tagName?.match(/^h([1-6])$/)) return;

        const base = slugify(extractNodeText(node)) || 'section';
        let id = base;
        let suffix = 1;
        while (identifiers.has(id)) {
            suffix += 1;
            id = `${base}-${suffix}`;
        }
        identifiers.add(id);
        node.properties = { ...node.properties, id };
    });
};
