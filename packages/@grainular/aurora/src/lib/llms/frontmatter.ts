const frontmatterPattern = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/;

const unquote = (value: string) => {
    const trimmed = value.trim();
    const quote = trimmed[0];
    return quote && quote === trimmed.at(-1) && (quote === '"' || quote === "'") ? trimmed.slice(1, -1) : trimmed;
};

export const readFrontmatterValue = (markdown: string, property: string) => {
    const frontmatter = markdown.match(frontmatterPattern)?.[1];
    const line = frontmatter?.split(/\r?\n/).find((entry) => entry.match(new RegExp(`^${property}\\s*:`)));
    return line ? unquote(line.slice(line.indexOf(':') + 1)) : undefined;
};

export const stripFrontmatter = (markdown: string) => markdown.replace(frontmatterPattern, '').trim();
