import { grain } from '@grainular/grains';
import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { $render, $unsafeHtml, html, mount, on, renderToString } from '../src';
import { setup } from './setup.spec';

describe('[Nørd Runtime] Rendering', () => {
    beforeEach(() => setup());

    test('should not render null or undefined values', () => {
        const App = () => html`<div>${null}${undefined}</div>`;
        mount(App, { to: document.querySelector('#app') });

        expect(document.querySelector('#app')?.firstElementChild?.textContent).toBe('');
    });

    test('should render an initial component fragment', () => {
        const comp = html`<div>Hello</div>`;
        const App = () => html`${$render(grain(comp))}`;

        mount(App, { to: document.querySelector('#app') });

        expect(renderToString(App)).toBe('<div>Hello</div>');
        expect(document.querySelector('#app')?.textContent).toBe('Hello');
    });

    test('should render a fragment directly', () => {
        const frag = html`<span>Direct</span>`;
        const App = () => html`${$render(grain(frag))}`;

        mount(App, { to: document.querySelector('#app') });

        expect(renderToString(App)).toBe('<span>Direct</span>');
        expect(document.querySelector('#app')?.textContent).toBe('Direct');
    });

    test('should update when the subscribable changes', () => {
        const val = grain(html`<p>One</p>`);
        const App = () => html`${$render(val)}`;

        mount(App, { to: document.querySelector('#app') });

        expect(renderToString(App)).toBe('<p>One</p>');
        expect(document.querySelector('#app')?.textContent).toBe('One');

        val.set(html`<p>Two</p>`);

        expect(renderToString(App)).toBe('<p>Two</p>');
        expect(document.querySelector('#app')?.textContent).toBe('Two');
    });

    test('should support fragments with events', () => {
        const handler = mock();
        const val = grain(html`<button ${on('click', handler)}>Click</button>`);
        const App = () => html`${$render(val)}`;

        mount(App, { to: document.querySelector('#app') });

        const btn = document.querySelector('button');
        btn?.click();
        expect(handler).toBeCalled();

        // Update fragment
        val.set(html`<button ${on('click', handler)}>Updated</button>`);
        const updatedBtn = document.querySelector('button');
        updatedBtn?.click();
        expect(handler).toBeCalledTimes(2);
    });

    test('should not render unsafe html', () => {
        const unsafeHtml = '<div>Hello World</div>';
        const EscapedApp = () => html`${unsafeHtml}`;
        mount(EscapedApp, { to: document.querySelector('#app') });

        expect(document.querySelector('#app')?.textContent).toBe(unsafeHtml);
    });

    test('should render unsafe html via $unsafeHtml', () => {
        const unsafeHtml = '<div>Hello World</div>';
        const App = () => html`${$unsafeHtml(unsafeHtml)}`;
        mount(App, { to: document.querySelector('#app') });

        expect(document.querySelector('#app')?.innerHTML).toBe(unsafeHtml);
    });
});
