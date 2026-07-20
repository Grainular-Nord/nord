import { visit } from 'unist-util-visit';
import { parseCodeBlockTitle } from './parse-code-block-title';
import { element, type MarkdownNode, text } from './remark-node';

const copyHost = () =>
    element(
        'codeGroupCopy',
        'div',
        {
            className: ['aurora-component', 'aurora-code-copy-host'],
            dataAuroraComponent: 'code-copy',
            dataAuroraComponentProps: '%7B%7D',
        },
        [
            element(
                'codeGroupCopyButton',
                'button',
                {
                    type: 'button',
                    className: ['aurora-code-copy'],
                    ariaLabel: 'Copy code',
                },
                [text('Copy')],
            ),
        ],
    );

export const remarkCodeGroups = () => (tree: MarkdownNode) => {
    let sequence = 0;

    visit(tree, (directive) => {
        if (directive.type !== 'containerDirective' || directive.name !== 'CodeGroup') return;

        const code = directive.children?.filter((child) => child.type === 'code') ?? [];
        const group = `aurora-code-group-${++sequence}`;
        const items = code.map((block, index) => {
            const id = `${group}-${index}`;
            const title = parseCodeBlockTitle(block.meta ?? '') ?? block.lang ?? `Example ${index + 1}`;
            block.meta = [block.meta, 'aurora-code-group'].filter(Boolean).join(' ');

            return element(
                'codeGroupItem',
                'div',
                {
                    className: ['aurora-code-group-item'],
                    style: `--aurora-code-tab: ${index + 1}`,
                },
                [
                    element('codeGroupInput', 'input', {
                        className: ['aurora-code-group-toggle'],
                        type: 'radio',
                        id,
                        name: group,
                        ...(index === 0 ? { checked: true } : {}),
                    }),
                    element(
                        'codeGroupLabel',
                        'label',
                        {
                            className: ['aurora-code-group-tab'],
                            htmlFor: id,
                        },
                        [text(title)],
                    ),
                    block,
                ],
            );
        });

        Object.assign(
            directive,
            element(
                'codeGroup',
                'fieldset',
                {
                    className: ['aurora-code-group'],
                    style: `--aurora-code-tabs: ${items.length}`,
                },
                [
                    element('codeGroupLegend', 'legend', { className: ['aurora-code-group-label'] }, [
                        text(directive.attributes?.label ?? 'Code examples'),
                    ]),
                    ...items,
                    copyHost(),
                ],
            ),
        );
    });
};
