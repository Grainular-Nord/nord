export type HtmlTemplateRange = {
    /** Inclusive offset of the first HTML character. */
    start: number;
    /** Exclusive offset after the last HTML character. */
    end: number;
};

export type HtmlTemplateFoldingRange = HtmlTemplateRange;

type CodeFrame = {
    kind: 'code';
    interpolation: boolean;
    braceDepth: number;
};

type TemplateFrame = {
    kind: 'template';
    tag: 'html' | 'plain';
    contentStart: number;
    templateStart: number;
};

type Frame = CodeFrame | TemplateFrame;

const isIdentifierPart = (character: string | undefined) => character !== undefined && /[\w$]/u.test(character);

const templateTagBefore = (source: string, backtick: number): TemplateFrame['tag'] => {
    let end = backtick;
    while (end > 0 && /\s/u.test(source[end - 1] ?? '')) end--;

    let start = end;
    while (start > 0 && isIdentifierPart(source[start - 1])) start--;

    return source.slice(start, end) === 'html' ? 'html' : 'plain';
};

const addRange = (ranges: HtmlTemplateRange[], frame: TemplateFrame, end: number) => {
    if (frame.tag === 'html' && frame.contentStart <= end) {
        ranges.push({ start: frame.contentStart, end });
    }
};

const skipQuotedString = (source: string, start: number, quote: "'" | '"') => {
    let cursor = start + 1;
    while (cursor < source.length) {
        if (source[cursor] === '\\') {
            cursor += 2;
            continue;
        }
        if (source[cursor] === quote) return cursor + 1;
        cursor++;
    }
    return cursor;
};

/**
 * Finds every literal HTML segment in an `html` tagged template. JavaScript
 * interpolation bodies are excluded, while nested `html` templates get their
 * own ranges.
 */
const scanNordHtmlTemplates = (source: string) => {
    const ranges: HtmlTemplateRange[] = [];
    const foldingRanges: HtmlTemplateFoldingRange[] = [];
    const frames: Frame[] = [{ kind: 'code', interpolation: false, braceDepth: 0 }];
    let cursor = 0;

    while (cursor < source.length) {
        const frame = frames.at(-1);
        if (!frame) break;

        if (frame.kind === 'template') {
            const character = source[cursor];

            if (character === '\\') {
                cursor += 2;
                continue;
            }
            if (character === '`') {
                addRange(ranges, frame, cursor);
                if (frame.tag === 'html') foldingRanges.push({ start: frame.templateStart, end: cursor });
                frames.pop();
                cursor++;
                continue;
            }
            if (character === '$' && source[cursor + 1] === '{') {
                addRange(ranges, frame, cursor);
                frames.push({ kind: 'code', interpolation: true, braceDepth: 0 });
                cursor += 2;
                continue;
            }

            cursor++;
            continue;
        }

        const character = source[cursor];
        const next = source[cursor + 1];

        if (character === "'" || character === '"') {
            cursor = skipQuotedString(source, cursor, character);
            continue;
        }
        if (character === '/' && next === '/') {
            const newline = source.indexOf('\n', cursor + 2);
            cursor = newline === -1 ? source.length : newline + 1;
            continue;
        }
        if (character === '/' && next === '*') {
            const close = source.indexOf('*/', cursor + 2);
            cursor = close === -1 ? source.length : close + 2;
            continue;
        }
        if (character === '`') {
            frames.push({
                kind: 'template',
                tag: templateTagBefore(source, cursor),
                contentStart: cursor + 1,
                templateStart: cursor + 1,
            });
            cursor++;
            continue;
        }
        if (frame.interpolation && character === '{') {
            frame.braceDepth++;
            cursor++;
            continue;
        }
        if (frame.interpolation && character === '}') {
            if (frame.braceDepth === 0) {
                frames.pop();
                const template = frames.at(-1);
                if (template?.kind === 'template') template.contentStart = cursor + 1;
            } else {
                frame.braceDepth--;
            }
            cursor++;
            continue;
        }

        cursor++;
    }

    const unterminatedTemplate = frames.at(-1);
    if (unterminatedTemplate?.kind === 'template') addRange(ranges, unterminatedTemplate, source.length);

    const byPosition = (left: HtmlTemplateRange, right: HtmlTemplateRange) =>
        left.start - right.start || left.end - right.end;
    return { ranges: ranges.sort(byPosition), foldingRanges: foldingRanges.sort(byPosition) };
};

export const getNordHtmlTemplateRanges = (source: string): HtmlTemplateRange[] => {
    return scanNordHtmlTemplates(source).ranges;
};

export const getNordHtmlTemplateFoldingRanges = (source: string): HtmlTemplateFoldingRange[] => {
    return scanNordHtmlTemplates(source).foldingRanges;
};

export const isInNordHtmlTemplate = (source: string, offset: number): boolean => {
    return getNordHtmlTemplateRanges(source).some((range) => range.start <= offset && offset <= range.end);
};
