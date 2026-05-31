import type { NodeData } from '..';
import { escapeHtmlString } from './escape-html-string';

export const createOutputFile = (
    content: string,
    meta: Record<PropertyKey, unknown>,
    components: Map<string, string>,
    nodes: Map<string, NodeData>,
) => {
    const componentEntries = [
        ...Array.from(components.entries()).map(([id, path]) => `import { ${id} } from "${path}";\n`),
    ];

    let template = escapeHtmlString(content);
    for (const [key, { name, props, children }] of nodes) {
        const insert = `\${${name}({...${props}, children: html\`${children}\`})}`;
        template = template.replace(`{{${key}}}`, insert);
    }

    // Clear the node map after consuming it
    nodes.clear();

    return `
import { html } from "@grainular/nord";

// Registered components
${componentEntries.join('')}

// Content (Frontmatter & Fragment)
export const meta = ${JSON.stringify(meta)};
export const content = html\`${template}\`;
`;
};
