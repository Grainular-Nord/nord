export type MarkdownNode = {
    type: string;
    name?: string;
    lang?: string | null;
    meta?: string | null;
    value?: string;
    attributes?: Record<string, string | null | undefined>;
    data?: {
        hName?: string;
        hProperties?: Record<string, unknown>;
    };
    children?: MarkdownNode[];
};

export const element = (
    type: string,
    tagName: string,
    properties: Record<string, unknown>,
    children: MarkdownNode[] = [],
): MarkdownNode => ({
    type,
    data: { hName: tagName, hProperties: properties },
    children,
});

export const text = (value: string): MarkdownNode => ({ type: 'text', value });
