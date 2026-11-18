// @vitest-environment node
import { grain } from '@grainular/grains';
import { describe, expect, test, vi } from 'vitest';
import { $tag, attr, createDirective, html, on, renderToString } from '../src';

describe('[Nørd SSR] $tag', () => {
    test('should render escaped text and empty children', () => {
        const App = () => html`${$tag({ as: 'p', children: '<hello & goodbye>' })}${$tag({ as: 'span' })}`;
        expect(renderToString(App)).toBe('<p>&lt;hello &amp; goodbye&gt;</p><span></span>');
    });

    test('should render nested fragments and current reactive values', () => {
        const name = grain('Alice');
        const label = grain<string | null>('first');
        const tag = $tag({ as: 'div', children: html`<strong>${name}</strong>`, use: [attr({ title: label })] });
        const App = () => html`${tag}`;
        expect(renderToString(App)).toBe('<div title="first"><strong>Alice</strong></div>');
        name.set('Bob');
        label.set('second');
        expect(renderToString(App)).toBe('<div title="second"><strong>Bob</strong></div>');
        label.set(null);
        expect(renderToString(App)).toBe('<div><strong>Bob</strong></div>');
    });

    test('should compose directive snapshots without running browser handlers', () => {
        const handler = vi.fn();
        const onMount = vi.fn();
        const directive = createDirective(handler, () => 'data-custom="yes"');
        const App = () =>
            html`${$tag({ as: 'button', children: 'Save', use: [attr({ disabled: true, hidden: false, 'aria-label': 'A & B' }), directive, on('click', handler)] }, onMount)}`;
        expect(renderToString(App)).toBe('<button disabled="" aria-label="A &amp; B" data-custom="yes">Save</button>');
        expect(handler).not.toHaveBeenCalled();
        expect(onMount).not.toHaveBeenCalled();
    });

    test('should render void elements without closing tags or children', () => {
        // oxfmt-ignore
        const App = () => html`${$tag({ as: 'input', children: 'ignored', use: [attr({ type: 'text' })] })}${$tag({ as: 'br' })}<span>After</span>`;
        expect(renderToString(App)).toBe('<input type="text"><br><span>After</span>');
    });
});
