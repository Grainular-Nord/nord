import type { AuroraSearchEntry } from '../config/config';

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();
const entities: Record<string, string> = { amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"' };
const decodeHtml = (value: string) =>
    value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (_match, entity: string) => {
        if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
        if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
        return entities[entity.toLowerCase()] ?? `&${entity};`;
    });

const attribute = (tag: string, name: string) => {
    const match = tag.match(new RegExp(`\\s${name}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?`, 'i'));
    return match ? (match[1] ?? match[2] ?? match[3] ?? '') : undefined;
};

const tagName = (tag: string) => tag.match(/^<\/?\s*([a-z][\w-]*)/i)?.[1]?.toLowerCase();

// UI chrome rendered into the content — code toolbars (title, language
// badge, copy button) and code group tabs — is presentation, not prose,
// and would otherwise pollute every code-heavy section's index entry.
// The code itself stays indexed; only the chrome around it is skipped.
const skippedClasses = [
    'aurora-code-toolbar',
    'aurora-code-copy-host',
    'aurora-code-group-tab',
    'aurora-code-group-label',
];
const isSkipped = (tag: string) => {
    const classes = attribute(tag, 'class');
    return Boolean(classes && skippedClasses.some((name) => classes.split(/\s+/).includes(name)));
};
const voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'source',
    'track',
    'wbr',
]);

type Section = { id: string; level: number; label: string; text: string[] };

const extractSections = (markup: string) => {
    const sections: Section[] = [];
    let active: Section | undefined;
    let contentDepth = 0;
    let headingText: string[] | undefined;
    let ignoredDepth = 0;
    let skippedAt: number | undefined;

    for (const token of markup.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? []) {
        if (token.startsWith('<!--')) continue;
        if (!token.startsWith('<')) {
            if (contentDepth === 0 || ignoredDepth > 0 || skippedAt !== undefined) continue;
            const text = decodeHtml(token);
            if (headingText) headingText.push(text);
            else if (active) active.text.push(text);
            continue;
        }

        const name = tagName(token);
        if (!name) continue;
        const closing = /^<\//.test(token);

        if (contentDepth === 0) {
            if (!closing && attribute(token, 'data-aurora-content') !== undefined) contentDepth = 1;
            continue;
        }

        if (closing) {
            if (name === 'script' || name === 'style') ignoredDepth = Math.max(0, ignoredDepth - 1);
            if (/^h[1-3]$/.test(name) && headingText && active) {
                active.label = normalizeText(headingText.join(' '));
                headingText = undefined;
            }
            contentDepth -= 1;
            if (skippedAt !== undefined && contentDepth <= skippedAt) skippedAt = undefined;
            if (contentDepth === 0) break;
            continue;
        }

        const heading = name.match(/^h([1-3])$/);
        if (heading) {
            active = { id: attribute(token, 'id') ?? '', level: Number(heading[1]), label: '', text: [] };
            sections.push(active);
            headingText = [];
        }
        if (name === 'script' || name === 'style') ignoredDepth += 1;
        if (!voidElements.has(name) && !token.endsWith('/>')) {
            if (skippedAt === undefined && isSkipped(token)) skippedAt = contentDepth;
            contentDepth += 1;
        }
    }

    return sections;
};

export const extractSearchEntries = (path: string, markup: string): AuroraSearchEntry[] => {
    const sections = extractSections(markup);
    const title = sections.find((section) => section.level === 1)?.label ?? sections[0]?.label ?? path;

    return sections
        .filter((section) => section.id)
        .map((section) => ({
            path,
            anchor: `#${section.id}`,
            title,
            section: section.label === title ? undefined : section.label,
            text: normalizeText(section.text.join(' ')),
        }));
};
