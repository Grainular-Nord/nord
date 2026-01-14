import { beforeEach, describe, expect, test } from 'bun:test';
import { createPortal, html, mount, portal } from '../src';
import { setup } from './setup.spec';

describe('[Nørd Runtime] Portals', () => {
    let target: HTMLElement;

    beforeEach(() => {
        setup();
        // Reset a portal target for each test
        target = document.createElement('div');
        document.body.appendChild(target);
    });

    test('createPortal mounts and cleans up nodes', () => {
        const myPortal = createPortal(target);

        const cleanup = myPortal.attach(() => html`<div id="portal-test">Hello Portal</div>`);

        // Check that the content was added to the target
        expect(target.querySelector('#portal-test')?.textContent).toBe('Hello Portal');

        // Cleanup should remove the nodes
        cleanup();
        expect(target.querySelector('#portal-test')).toBeNull();
    });

    test('createPortal throws if target is undefined', () => {
        const portalFn = () => createPortal(null).attach(() => html`<div>Fail</div>`);
        expect(portalFn).toThrow('[Nord] Portal target not defined');
    });

    test('portal directive moves node to target and cleans up', () => {
        const div = document.createElement('div');
        div.id = 'directive-test';
        const directive = portal(target);

        const cleanup = directive.hydrate(div);

        // Node should now be in the target
        expect(target.querySelector('#directive-test')).toBe(div);
    });

    test('portal directive throws if target is undefined', () => {
        const div = document.createElement('div');
        const directiveFn = () => portal(null).hydrate(div);
        expect(directiveFn).toThrow('[Nord] Portal target not defined');
    });

    test('portal directive works with mount/html', () => {
        const App = () => html`<div ${portal(target)} id="mounted">I'm in portal</div>`;
        mount(App, { to: document.querySelector('#app') });

        expect(target.querySelector('#mounted')?.textContent).toBe("I'm in portal");
    });
});
