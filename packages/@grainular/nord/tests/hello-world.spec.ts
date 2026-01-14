import { beforeEach, describe, expect, test } from 'bun:test';
import { html, mount, renderToString } from '../src';
import { setup } from './setup.spec';

/**
 * Similar to the baseline test, this test really just tests
 * if the basic rendering and mounting pipeline works as expected
 * If this test fails, we either messed up something important
 * or we killed the test setup.
 */
describe('[Nørd Runtime] Hello World', () => {
    beforeEach(() => setup());

    test('Hello World works as expected', () => {
        // Create and mount the app directly to the DOM.
        const App = () => html`Hello World`;
        mount(App, { to: document.querySelector('#app') });

        // We then check if the a) the renderer works and b) the application was correctly mounted
        expect(renderToString(App)).toBe('Hello World');
        expect(document.body.innerHTML).toBe('<div id="app">Hello World</div>');
    });
});
