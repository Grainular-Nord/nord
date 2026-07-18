import { describe, expect, test } from 'bun:test';
import { getAutoClosingTag } from '../src/core/closing-tag';

const closingTagAtCursor = (markedSource: string) => {
    const offset = markedSource.indexOf('¦');
    if (offset === -1) throw new Error('Test source needs a ¦ cursor marker');
    return getAutoClosingTag(markedSource.replace('¦', ''), offset);
};

describe('getAutoClosingTag', () => {
    test('closes a standard element', () => {
        expect(closingTagAtCursor('html`<div>¦`')).toBe('</div>');
    });

    test('preserves a custom element name', () => {
        expect(closingTagAtCursor('html`<app-shell data-ready>¦`')).toBe('</app-shell>');
    });

    test('does not close a void element', () => {
        expect(closingTagAtCursor('html`<input>¦`')).toBeUndefined();
    });

    test('does not close a self-closing element', () => {
        expect(closingTagAtCursor('html`<widget />¦`')).toBeUndefined();
    });

    test('does not duplicate an existing closing tag', () => {
        expect(closingTagAtCursor('html`<div>¦</div>`')).toBeUndefined();
    });

    test('does not operate outside an html template', () => {
        expect(closingTagAtCursor('const comparison = left < right>¦;')).toBeUndefined();
    });
});
