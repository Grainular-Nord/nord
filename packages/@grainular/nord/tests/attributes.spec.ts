import { grain } from '@grainular/grains';
import { beforeEach, describe, expect, test } from 'vitest';
import { attr, html, mount, on, renderToString } from '../src';
import { setup } from './setup';

/**
 * This test suite explicitly tests the attribute binding
 * system with static and dynamic values.
 */
describe('[Nørd Runtime] Attribute bindings', () => {
    beforeEach(() => setup());

    test('should add a attribute via fragment to an element', () => {
        const App = () => {
            return html`<div data-test="${0}"></div>`;
        };

        mount(App, { to: document.querySelector('#app') });

        expect(document.querySelector('#app')?.firstElementChild?.hasAttribute('data-test')).toBeTruthy();
        expect(document.querySelector('#app')?.firstElementChild?.getAttribute('data-test')).toBe('0');
    });

    test('should add a reactive attribute binding to an element', () => {
        const Counter = () => {
            const count = grain(0);
            return html`<button data-count="${count}" ${on('click', () => count.set(count() + 1))}>${count}</button>`;
        };

        mount(Counter, { to: document.querySelector('#app') });
        const button = document.querySelector('#app > button') as HTMLButtonElement | null;

        expect(button).toBeDefined();
        expect(button?.getAttribute('data-count')).toBe('0');
        button?.click();
        expect(button?.getAttribute('data-count')).toBe('1');
    });

    test('should mix reactive and non reactive properties in a binding', () => {
        const dynamic = grain('test');
        const App = () => {
            return html`<div class="start ${dynamic} end"></div>`;
        };
        mount(App, { to: document.querySelector('#app') });

        // Check if the element has the correct class attribute
        expect(document.querySelector('#app')?.firstElementChild?.className).toBe('start test end');

        // Change the dynamic part
        dynamic.set('updated');
        expect(document.querySelector('#app')?.firstElementChild?.className).toBe('start updated end');
    });

    test('should correctly assign boolean attributes without value', () => {
        const disabled = grain(false);
        const App = () => html`<button disabled="${disabled}"></button>`;
        mount(App, { to: document.querySelector('#app') });

        // Check state of the falsy attribute
        expect(document.querySelector('#app')?.firstElementChild?.hasAttribute('disabled')).toBeFalsy();
        expect(document.querySelector('#app')?.firstElementChild?.outerHTML).toBe('<button></button>');

        // Set disabled and check state
        disabled.set(true);
        expect(document.querySelector('#app')?.firstElementChild?.hasAttribute('disabled')).toBeTruthy();
        expect(document.querySelector('#app')?.firstElementChild?.outerHTML).toBe('<button disabled=""></button>');
    });

    test.each([null, undefined])('should omit and restore a nullish reactive attribute: %s', (empty) => {
        const value = grain<string | null | undefined>(empty);
        const App = () => html`<div title="${value}" ${attr({ 'aria-label': value })}></div>`;
        mount(App, { to: document.querySelector('#app') });
        const node = document.querySelector('#app > div')!;

        expect(node.hasAttribute('title')).toBe(false);
        expect(node.hasAttribute('aria-label')).toBe(false);
        value.set('hello');
        expect(node.getAttribute('title')).toBe('hello');
        expect(node.getAttribute('aria-label')).toBe('hello');
        value.set(empty);
        expect(node.hasAttribute('title')).toBe(false);
        expect(node.hasAttribute('aria-label')).toBe(false);
    });

    test('should keep nullish segments in mixed attributes empty', () => {
        const first = grain<string | null>(null);
        const second = grain<string | undefined>('end');
        const App = () => html`<div class="prefix ${first} ${second}"></div>`;
        mount(App, { to: document.querySelector('#app') });
        const node = document.querySelector('#app > div')!;
        expect(node.getAttribute('class')).toBe('prefix  end');
        first.set('middle');
        second.set(undefined);
        expect(node.getAttribute('class')).toBe('prefix middle ');
        expect(renderToString(App)).toBe('<div class="prefix middle undefined"></div>');
    });

    test('should apply attribute directive rules in SSR and the browser', () => {
        const value = grain<string | null>('a & "b"');
        const App = () =>
            html`<input ${attr({ hidden: false, checked: true, 'aria-label': value, 'data-missing': undefined })} />`;
        const snapshot = renderToString(App);
        const container = document.createElement('div');
        container.innerHTML = snapshot;
        mount(App, { to: document.querySelector('#app') });
        expect(container.firstElementChild?.outerHTML).toBe(document.querySelector('#app > input')?.outerHTML);
        expect(snapshot).toContain('aria-label="a &amp; &quot;b&quot;"');
        value.set(null);
        expect(renderToString(App)).not.toContain('aria-label=');
    });

    test('should preserve existing SSR behavior for direct attribute interpolations', () => {
        const value = grain<string | null | undefined>(null);
        const App = () => html`<div title="${null}" data-value="${value}" disabled="${false}"></div>`;
        expect(renderToString(App)).toBe('<div title="" data-value="null" disabled="false"></div>');
        value.set(undefined);
        expect(renderToString(App)).toBe('<div title="" data-value="undefined" disabled="false"></div>');
    });
    test('should treat falsy boolean values consistently across bindings', () => {
        const App = () =>
            html`<input disabled="${0}" required="${'false'}" ${attr({ hidden: 0, checked: 'false' })} />`;
        mount(App, { to: document.querySelector('#app') });
        expect(document.querySelector('#app > input')?.attributes).toHaveLength(0);
    });

    test('should preserve escaped literal text in mixed SSR attributes', () => {
        const App = () => html`<div title='a "quote" &amp; ${'value & more'}'></div>`;
        const container = document.createElement('div');
        container.innerHTML = renderToString(App);
        mount(App, { to: document.querySelector('#app') });
        expect(container.firstElementChild?.getAttribute('title')).toBe(
            document.querySelector('#app > div')?.getAttribute('title'),
        );
    });
});
