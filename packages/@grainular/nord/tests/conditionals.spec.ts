import { grain } from '@grainular/grains';
import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { $if, $switch, html, mount, on, renderToString } from '../src';
import { setup } from './setup.spec';

/**
 * We test our conditional rendering here in
 * this test suite. $if and $switch are used
 * to conditionally render values / templates
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

    test('should update mount and unmount nodes using the lifecycle observer', () => {
        // Create and mount the app directly to the DOM.
        const bool = grain(true);
        const handler = mock(() => {});
        const App = () => {
            return html`${$if(bool, () => {
                return html`<button ${on('click', () => handler())}>Is True</button>`;
            })}`;
        };
        mount(App, { to: document.querySelector('#app') });

        // We then check if the a) the renderer works and b) the application was correctly mounted
        expect(renderToString(App)).toBe('<button >Is True</button>');
        expect(document.querySelector('#app')?.firstElementChild?.tagName).toBe('BUTTON');
        (document.querySelector('#app > button') as HTMLButtonElement).click();
        expect(handler).toBeCalled();

        // Update the grain
        bool.set(false);
        expect(renderToString(App)).toBe('');
        expect(document.querySelector('#app')?.textContent).toBe('');
    });

    test('should render the correct case based on a static value', () => {
        const App = () =>
            html`${$switch(() => 2)
                .$case(1, () => html`Case 1`)
                .$case(2, () => html`Case 2`)
                .$default(() => html`Default`)}`;

        mount(App, { to: document.querySelector('#app') });

        expect(renderToString(App)).toBe('Case 2');
        expect(document.querySelector('#app')?.textContent).toBe('Case 2');
    });

    test('should render default if no cases match', () => {
        const App = () =>
            html`${$switch(() => 3)
                .$case(1, () => html`Case 1`)
                .$case(2, () => html`Case 2`)
                .$default(() => html`Default`)}`;

        mount(App, { to: document.querySelector('#app') });

        expect(renderToString(App)).toBe('Default');
        expect(document.querySelector('#app')?.textContent).toBe('Default');
    });

    test('should update when a grain changes', () => {
        const val = grain(1);
        const App = () =>
            html`${$switch(val)
                .$case(1, () => html`Case 1`)
                .$case(2, () => html`Case 2`)
                .$default(() => html`Default`)}`;

        mount(App, { to: document.querySelector('#app') });

        expect(renderToString(App)).toBe('Case 1');
        expect(document.querySelector('#app')?.textContent).toBe('Case 1');

        val.set(2);
        expect(renderToString(App)).toBe('Case 2');
        expect(document.querySelector('#app')?.textContent).toBe('Case 2');

        val.set(99);
        expect(renderToString(App)).toBe('Default');
        expect(document.querySelector('#app')?.textContent).toBe('Default');
    });

    test('should mount and unmount nodes correctly with event handlers', () => {
        const val = grain(1);
        const handler = mock(() => {});
        const App = () =>
            html`${$switch(val)
                .$case(1, () => html`<button ${on('click', () => handler())}>One</button>`)
                .$case(2, () => html`<button ${on('click', () => handler())}>Two</button>`)
                .$default(() => html`Default`)}`;

        mount(App, { to: document.querySelector('#app') });

        const button1 = document.querySelector('button') as HTMLButtonElement;
        expect(button1.textContent).toBe('One');
        button1.click();
        expect(handler).toBeCalled();

        // Update to second case
        val.set(2);
        const button2 = document.querySelector('button') as HTMLButtonElement;
        expect(button2.textContent).toBe('Two');
        button2.click();
        expect(handler).toBeCalledTimes(2);

        // Update to default
        val.set(99);
        expect(document.querySelector('button')).toBeNull();
        expect(document.querySelector('#app')?.textContent).toBe('Default');
    });
});
