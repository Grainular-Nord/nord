import { VOID_HTML_TAGS } from './html-tags';
import { isInNordHtmlTemplate } from './template-context';

const voidTags = new Set<string>(VOID_HTML_TAGS);

/** Returns the closing tag to insert after a freshly typed `>`. */
export const getAutoClosingTag = (source: string, offset: number): string | undefined => {
    if (source[offset - 1] !== '>' || !isInNordHtmlTemplate(source, offset)) return undefined;

    const openingBracket = source.lastIndexOf('<', offset - 1);
    if (openingBracket === -1) return undefined;

    const openingTag = source.slice(openingBracket, offset);
    const match = /^<([A-Za-z][\w:-]*)(?:\s[^<>]*)?>$/u.exec(openingTag);
    const tag = match?.[1];
    if (!tag || openingTag.endsWith('/>') || voidTags.has(tag.toLowerCase())) return undefined;

    const closingTag = `</${tag}>`;
    if (source.slice(offset).startsWith(closingTag)) return undefined;

    return closingTag;
};
