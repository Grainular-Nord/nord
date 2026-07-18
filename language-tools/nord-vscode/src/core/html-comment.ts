import { getNordHtmlTemplateFoldingRanges, getNordHtmlTemplateRanges } from './template-context';

export type HtmlCommentEdit = {
    start: number;
    end: number;
    replacement: string;
    cursor: number;
};

const uncomment = (source: string, start: number, end: number): HtmlCommentEdit => {
    const replacement = source.slice(start + 4, end - 3).replace(/^\s+|\s+$/gu, '');
    return { start, end, replacement, cursor: start + replacement.length };
};

export const getHtmlCommentEdit = (source: string, selectionStart: number, selectionEnd: number) => {
    const literalRanges = getNordHtmlTemplateRanges(source);
    const range = literalRanges.find((candidate) => candidate.start <= selectionStart && selectionEnd <= candidate.end);
    const startsInMarkup = literalRanges.some(
        (candidate) => candidate.start <= selectionStart && selectionStart <= candidate.end,
    );
    const endsInMarkup = literalRanges.some(
        (candidate) => candidate.start <= selectionEnd && selectionEnd <= candidate.end,
    );
    const containingTemplate = getNordHtmlTemplateFoldingRanges(source).find(
        (candidate) => candidate.start <= selectionStart && selectionEnd <= candidate.end,
    );
    if (!range && !(startsInMarkup && endsInMarkup && containingTemplate)) return undefined;

    const selected = source.slice(selectionStart, selectionEnd);
    if (selected.startsWith('<!--') && selected.endsWith('-->')) {
        return uncomment(source, selectionStart, selectionEnd);
    }

    if (selectionStart === selectionEnd) {
        const commentStart = source.lastIndexOf('<!--', selectionStart);
        const commentEnd = source.indexOf('-->', selectionStart);
        const previousCommentEnd = source.lastIndexOf('-->', selectionStart);

        if (
            range &&
            commentStart >= range.start &&
            commentEnd !== -1 &&
            commentEnd + 3 <= range.end &&
            previousCommentEnd < commentStart
        ) {
            return uncomment(source, commentStart, commentEnd + 3);
        }
    }

    const replacement = `<!-- ${selected} -->`;
    return {
        start: selectionStart,
        end: selectionEnd,
        replacement,
        cursor: selectionStart + 5,
    };
};
