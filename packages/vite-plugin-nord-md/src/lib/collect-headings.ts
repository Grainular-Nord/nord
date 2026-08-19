export type MarkdownHeading = {
    level: number;
    id?: string;
    label: string;
};

type HastNode = {
    type?: string;
    tagName?: string;
    value?: string;
    properties?: Record<string, unknown>;
    children?: HastNode[];
};

const nodeText = (node: HastNode): string => {
    if (node.type === 'text') return node.value ?? '';
    return (node.children ?? []).map(nodeText).join('');
};

export const collectHeadings = (headings: MarkdownHeading[]) => () => (tree: HastNode) => {
    const visit = (node: HastNode) => {
        const match = node.tagName?.match(/^h([1-6])$/);
        if (match) {
            const id = node.properties?.id;
            headings.push({
                level: Number(match[1]),
                ...(typeof id === 'string' ? { id } : {}),
                label: nodeText(node).trim(),
            });
        }

        for (const child of node.children ?? []) visit(child);
    };

    visit(tree);
};
