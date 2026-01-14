import { grain } from '@grainular/grains';
import { beforeEach, describe, expect, test } from 'bun:test';
import { html, mount, on } from '../src';
import { setup } from './setup.spec';

/**
 * The counter example is a more in depth example, testing
 * granular rerendering as well as directives and event handling
 */

describe('[Nørd Runtime] Counter', () => {
    beforeEach(() => setup());

    test('should render a button with content 0', () => {
        const Counter = () => {
            const count = grain(0);
            return html`<button>${count}</button>`;
        };

        mount(Counter, { to: document.querySelector('#app') });
        const element = document.querySelector('#app')?.firstElementChild;

        expect(element?.tagName).toBe('BUTTON');
        expect(element?.textContent).toBe('0');
    });

    test('should update text content but not element when grain changes', () => {
        const count = grain(0);
        const Counter = () => {
            return html`<button>${count}</button>`;
        };
        mount(Counter, { to: document.querySelector('#app') });

        const element = document.querySelector('#app')?.firstElementChild;
        expect(element).toBeDefined();
        expect(element?.textContent).toBe('0');

        // Update the grain
        count.set(1);
        expect(element).toBe(document.querySelector('#app')?.firstElementChild);
        expect(element?.textContent).toBe('1');
    });

    test('should update text content but not element when clicked', () => {
        const Counter = () => {
            const count = grain(0);
            return html`<button ${on('click', () => count.set(count() + 1))}>${count}</button>`;
        };
        mount(Counter, { to: document.querySelector('#app') });

        const element = document.querySelector('#app')?.firstElementChild;
        expect(element).toBeDefined();
        expect(element?.textContent).toBe('0');

        // Update the grain
        (element as HTMLButtonElement).click();
        expect(element).toBe(document.querySelector('#app')?.firstElementChild);
        expect(element?.textContent).toBe('1');
    });
});
