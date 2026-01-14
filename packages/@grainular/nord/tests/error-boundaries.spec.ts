import { beforeEach, describe, expect, test } from 'bun:test';
import { html, mount } from '../src';
import { $try } from '../src/structs/try.struct';
import { setup } from './setup.spec';

describe('[Nørd Runtime] $try / Error Boundaries', () => {
    beforeEach(() => setup());

    test('should render successful content when no error occurs', () => {
        const Comp = () => html`
            ${$try(() => html`<span class="ok">Success</span>`).$catch(
                (err: unknown) => html`<span class="fallback">${String(err)}</span>`,
            )}
        `;

        mount(Comp, { to: document.querySelector('#app') });

        const node = document.querySelector('.ok');
        expect(node).toBeDefined();
        expect(node?.textContent).toBe('Success');

        const fallbackNode = document.querySelector('.fallback');
        expect(fallbackNode).toBeNull();
    });

    test('should render fallback when synchronous error occurs', () => {
        const Comp = () => html`
            ${$try(() => {
                throw new Error('Fail!');
            }).$catch(
                (err: unknown) =>
                    html`<span class="fallback">${String(err instanceof Error ? err.message : err)}</span>`,
            )}
        `;

        mount(Comp, { to: document.querySelector('#app') });

        const fallbackNode = document.querySelector('.fallback');
        expect(fallbackNode).toBeDefined();
        expect(fallbackNode?.textContent).toBe('Fail!');

        const node = document.querySelector('.ok');
        expect(node).toBeNull();
    });

    test('should handle unknown error types gracefully', () => {
        const Comp = () => html`
            ${$try(() => {
                throw 'string error';
            }).$catch((err: unknown) => html`<span class="fallback">${String(err)}</span>`)}
        `;

        mount(Comp, { to: document.querySelector('#app') });

        const fallbackNode = document.querySelector('.fallback');
        expect(fallbackNode).toBeDefined();
        expect(fallbackNode?.textContent).toBe('string error');
    });

    test('should replace previous nodes with fallback on error', () => {
        const Comp = () => html`
            ${$try(() => html`<span class="ok">Initial</span>`).$catch(
                (err: unknown) => html`<span class="fallback">${String(err)}</span>`,
            )}
        `;

        const container = document.querySelector('#app');
        mount(Comp, { to: container });

        // force error by remounting with throwing component
        const ErrorComp = () => html`
            ${$try(() => {
                throw new Error('Boom!');
            }).$catch(
                (err: unknown) =>
                    html`<span class="fallback">${String(err instanceof Error ? err.message : err)}</span>`,
            )}
        `;

        mount(ErrorComp, { to: container });

        const node = container?.querySelector('.ok');
        expect(node).toBeNull();

        const fallbackNode = container?.querySelector('.fallback');
        expect(fallbackNode).toBeDefined();
        expect(fallbackNode?.textContent).toBe('Boom!');
    });
});
