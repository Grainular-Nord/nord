import { describe, expect, test } from 'vitest';
import { getHtmlCommentEdit } from '../src/core/html-comment';

const editAtMarkers = (markedSource: string) => {
    const first = markedSource.indexOf('¦');
    const withoutFirst = markedSource.replace('¦', '');
    const second = withoutFirst.indexOf('¦');
    const source = withoutFirst.replace('¦', '');
    const end = second === -1 ? first : second;
    return { source, edit: getHtmlCommentEdit(source, first, end) };
};

describe('getHtmlCommentEdit', () => {
    test('inserts an empty comment at the cursor', () => {
        const { edit } = editAtMarkers('html`<div>¦</div>`');
        expect(edit?.replacement).toBe('<!--  -->');
    });

    test('wraps selected markup', () => {
        const { edit } = editAtMarkers('html`¦<p>Hello</p>¦`');
        expect(edit?.replacement).toBe('<!-- <p>Hello</p> -->');
    });

    test('unwraps a selected comment', () => {
        const { edit } = editAtMarkers('html`¦<!-- <p>Hello</p> -->¦`');
        expect(edit?.replacement).toBe('<p>Hello</p>');
    });

    test('unwraps the comment containing an empty cursor', () => {
        const { edit } = editAtMarkers('html`<!-- <p>Hel¦lo</p> -->`');
        expect(edit?.replacement).toBe('<p>Hello</p>');
    });

    test('comments markup across an interpolation', () => {
        const { edit } = editAtMarkers('html`¦<p>${name}</p>¦`');
        expect(edit?.replacement).toBe('<!-- <p>${name}</p> -->');
    });

    test('refuses to comment ordinary TypeScript', () => {
        const { edit } = editAtMarkers('const value = ¦1;');
        expect(edit).toBeUndefined();
    });
});
