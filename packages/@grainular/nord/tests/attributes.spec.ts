import { grain } from '@grainular/grains';
import { beforeEach, describe, expect, test } from 'bun:test';
import { html, mount, on } from '../src';
import { setup } from './setup.spec';

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

        expect(document.querySelector('#app')?.firstElementChild?.hasAttribute('data-test')).toBeTrue();
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
        expect(document.querySelector('#app')?.firstElementChild?.hasAttribute('disabled')).toBeFalse();
        expect(document.querySelector('#app')?.firstElementChild?.outerHTML).toBe('<button></button>');

        // Set disabled and check state
        disabled.set(true);
        expect(document.querySelector('#app')?.firstElementChild?.hasAttribute('disabled')).toBeTrue();
        expect(document.querySelector('#app')?.firstElementChild?.outerHTML).toBe('<button disabled=""></button>');
    });
});
