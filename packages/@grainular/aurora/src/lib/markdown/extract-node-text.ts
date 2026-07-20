import type { HastNode } from './hast-node';

export const extractNodeText = (node: HastNode): string => {
    if (node.type === 'text') return node.value ?? '';
    return (node.children ?? []).map(extractNodeText).join('');
};
