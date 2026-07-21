import { describe, expect, test } from 'vitest';
import {
    getNordHtmlTemplateFoldingRanges,
    getNordHtmlTemplateRanges,
    isInNordHtmlTemplate,
} from '../src/core/template-context';

const classify = (markedSource: string) => {
    const offset = markedSource.indexOf('¦');
    if (offset === -1) throw new Error('Test source needs a ¦ cursor marker');
    return isInNordHtmlTemplate(markedSource.replace('¦', ''), offset);
};

describe('isInNordHtmlTemplate', () => {
    test('classifies literal html template content', () => {
        expect(classify('const view = html`<div>¦</div>`;')).toBe(true);
    });

    test('does not classify ordinary template literals', () => {
        expect(classify('const value = `hello ¦world`;')).toBe(false);
    });

    test('does not classify an html interpolation as markup', () => {
        expect(classify('const view = html`<div>${user.¦name}</div>`;')).toBe(false);
    });

    test('returns to markup after an interpolation', () => {
        expect(classify('const view = html`<div>${user.name}<span>¦</span></div>`;')).toBe(true);
    });

    test('handles object and block braces inside an interpolation', () => {
        const source = 'html`<div>${items.map((item) => { return { item }; })}<span>¦</span></div>`';
        expect(classify(source)).toBe(true);
    });

    test('handles braces inside strings and comments', () => {
        const source = 'html`${fn("}") /* } */ // }\n}<span>¦</span>`';
        expect(classify(source)).toBe(true);
    });

    test('classifies a nested html template independently', () => {
        expect(classify('html`${items.map(() => html`<span>¦</span>`)}`')).toBe(true);
    });

    test('does not classify a plain nested template', () => {
        expect(classify('html`${items.map(() => `value: ¦${value}`)}`')).toBe(false);
    });

    test('ignores escaped interpolation markers', () => {
        expect(classify('html`\\${notAnExpression}¦`')).toBe(true);
    });

    test('does not classify content after a closed template', () => {
        expect(classify('html`<div></div>`; const value = ¦1;')).toBe(false);
    });

    test('returns a separate range for each literal segment', () => {
        const source = 'html`<p>${name}</p>`';
        expect(getNordHtmlTemplateRanges(source).map(({ start, end }) => source.slice(start, end))).toEqual([
            '<p>',
            '</p>',
        ]);
    });

    test('returns ranges for nested html templates', () => {
        const source = 'html`<ul>${items.map(() => html`<li>item</li>`)}</ul>`';
        expect(getNordHtmlTemplateRanges(source).map(({ start, end }) => source.slice(start, end))).toEqual([
            '<ul>',
            '<li>item</li>',
            '</ul>',
        ]);
    });

    test('returns one folding range for a complete template including interpolations', () => {
        const source = 'const view = html`\n  <p>${name}</p>\n`;';
        expect(getNordHtmlTemplateFoldingRanges(source).map(({ start, end }) => source.slice(start, end))).toEqual([
            '\n  <p>${name}</p>\n',
        ]);
    });

    test('returns independent folding ranges for nested templates', () => {
        const source = 'html`\n${items.map(() => html`\n<li>item</li>\n`)}\n`';
        expect(getNordHtmlTemplateFoldingRanges(source)).toHaveLength(2);
    });
});
