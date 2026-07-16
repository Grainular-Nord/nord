import type { ShikiTransformer } from 'shiki';

const titlePattern = /(?:^|\s)(?:title|filename)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/;
const highlightPattern = /(?:^|\s)\{([\d,\s-]+)\}(?=\s|$)/;
const blurPattern = /(?:^|\s)blur(?::|=)true(?=\s|$)/i;

const codeCopyHost = () => ({
    type: 'element' as const,
    tagName: 'div',
    properties: {
        className: ['aurora-component', 'aurora-code-copy-host'],
        'data-aurora-component': 'code-copy',
        'data-aurora-component-props': '%7B%7D',
    },
    children: [
        {
            type: 'element' as const,
            tagName: 'button',
            properties: {
                type: 'button',
                className: ['aurora-code-copy'],
                ariaLabel: 'Copy code',
            },
            children: [{ type: 'text' as const, value: 'Copy' }],
        },
    ],
});

const parseHighlightedLines = (meta: string) => {
    const lines = new Set<number>();
    const ranges = meta.match(highlightPattern)?.[1]?.split(',') ?? [];

    for (const range of ranges) {
        const [start, end = start] = range.trim().split('-').map(Number);
        if (!start || !end || end < start) continue;
        for (let line = start; line <= end; line += 1) lines.add(line);
    }

    return lines;
};

export const codeBlockTransformer = (): ShikiTransformer => {
    return {
        name: 'aurora:code-block',
        preprocess(_code, options) {
            (this.meta as { highlightedLines?: Set<number> }).highlightedLines = parseHighlightedLines(
                options.meta?.__raw ?? '',
            );
        },
        line(node, line) {
            const highlightedLines = (this.meta as { highlightedLines?: Set<number> }).highlightedLines;
            if (highlightedLines?.has(line)) this.addClassToHast(node, 'highlighted');

            if (this.options.lang === 'diff') {
                const source = this.source.split('\n')[line - 1]?.trimStart();
                if (source?.startsWith('+')) this.addClassToHast(node, 'diff-add');
                if (source?.startsWith('-')) this.addClassToHast(node, 'diff-remove');
            }
        },
        root(root) {
            const meta = this.options.meta?.__raw ?? '';
            const titleMatch = meta.match(titlePattern);
            const title = titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3];
            const language = String(this.options.lang);
            const highlightedLines = (this.meta as { highlightedLines?: Set<number> }).highlightedLines;
            const blur = blurPattern.test(meta) && Boolean(highlightedLines?.size);
            const pre = root.children[0];
            if (pre?.type !== 'element') return;

            root.children = [
                {
                    type: 'element',
                    tagName: 'figure',
                    properties: {
                        className: ['aurora-code-block', ...(blur ? ['aurora-code-focus'] : [])],
                    },
                    children: [
                        {
                            type: 'element',
                            tagName: 'figcaption',
                            properties: { className: ['aurora-code-toolbar'] },
                            children: [
                                {
                                    type: 'element',
                                    tagName: 'span',
                                    properties: { className: ['aurora-code-title'] },
                                    children: [{ type: 'text', value: title ?? language }],
                                },
                                ...(title
                                    ? [
                                          {
                                              type: 'element' as const,
                                              tagName: 'span',
                                              properties: { className: ['aurora-code-language'] },
                                              children: [{ type: 'text' as const, value: language }],
                                          },
                                      ]
                                    : []),
                                codeCopyHost(),
                            ],
                        },
                        pre,
                    ],
                },
            ];
        },
    };
};
