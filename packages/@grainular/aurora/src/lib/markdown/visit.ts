import type { HastNode } from './hast-node';

export const visit = (tree: HastNode, callback: (node: HastNode) => void) => {
    callback(tree);
    for (const child of tree.children ?? []) visit(child, callback);
};
