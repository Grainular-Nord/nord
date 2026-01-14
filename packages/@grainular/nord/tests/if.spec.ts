import { grain } from '@grainular/grains';
import { beforeEach, describe, expect, test } from 'bun:test';
import { $if, html, mount, renderToString } from '../src';
import { setup } from './setup.spec';

/**
 * If tests the
 */
describe('[Nørd Runtime] Conditionals', () => {
    beforeEach(() => setup());

    test('should render based on a boolean', () => {
        // Create and mount the app directly to the DOM.
        const App = () => {
            return html`${$if(
                () => true,
                () => html`Is True`,
            )}`;
        };
        mount(App, { to: document.querySelector('#app') });

        // We then check if the a) the renderer works and b) the application was correctly mounted
        expect(renderToString(App)).toBe('Is True');
        expect(document.querySelector('#app')?.textContent).toBe('Is True');
    });

    test('should render negative based on a boolean', () => {
        // Create and mount the app directly to the DOM.
        const App = () => {
            return html`${$if(
                () => false,
                () => html`Is True`,
            ).$else(() => html`Is False`)}`;
        };
        mount(App, { to: document.querySelector('#app') });

        // We then check if the a) the renderer works and b) the application was correctly mounted
        expect(renderToString(App)).toBe('Is False');
        expect(document.querySelector('#app')?.textContent).toBe('Is False');
    });

    test('should update based on a boolean subscribable', () => {
        // Create and mount the app directly to the DOM.
        const bool = grain(true);
        const App = () => {
            return html`${$if(bool, () => html`Is True`).$else(() => html`Is False`)}`;
        };
        mount(App, { to: document.querySelector('#app') });

        // We then check if the a) the renderer works and b) the application was correctly mounted
        expect(renderToString(App)).toBe('Is True');
        expect(document.querySelector('#app')?.textContent).toBe('Is True');

        // Update the grain
        bool.set(false);
        expect(renderToString(App)).toBe('Is False');
        expect(document.querySelector('#app')?.textContent).toBe('Is False');
    });
});
