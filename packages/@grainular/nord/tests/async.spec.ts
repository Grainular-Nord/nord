import { beforeEach, describe, expect, test } from 'bun:test';
import { $await, $suspend, html, mount } from '../src';
import { setup } from './setup.spec';

describe('[Nørd Runtime] Async Operations', () => {
    beforeEach(() => setup());

    test('should render pending state initially', () => {
        const promise: Promise<string> = new Promise(() => {});
        const Comp = () =>
            html`<div>
                ${$await(promise)
                    .$then((v: string) => html`<span>${v}</span>`)
                    .$pending(() => html`<span>Loading...</span>`)}
            </div>`;

        mount(Comp, { to: document.querySelector('#app') });
        const span = document.querySelector('span');
        expect(span).toBeDefined();
        expect(span?.textContent).toBe('Loading...');
    });

    test('should render resolved value and remove pending', async () => {
        let resolveFn: ((value: string) => void) | undefined;
        const promise: Promise<string> = new Promise((resolve) => {
            resolveFn = resolve;
        });

        const Comp = () =>
            html`<div>
                ${$await(promise)
                    .$then((v: string) => html`<span>${v}</span>`)
                    .$pending(() => html`<span>Loading...</span>`)}
            </div>`;

        mount(Comp, { to: document.querySelector('#app') });

        // initially pending
        expect(document.querySelector('span')?.textContent).toBe('Loading...');

        // resolve promise
        resolveFn?.('undefined');
        await Promise.resolve();

        const span = document.querySelector('span');
        expect(span?.textContent).toBe('undefined'); // optional: adjust if resolveFn needs value
    });

    test('should render error state if promise rejects', async () => {
        let rejectFn: ((error: Error) => void) | undefined;
        const promise: Promise<string> = new Promise((_, reject) => {
            rejectFn = reject;
        });

        const Comp = () =>
            html`<div>
                ${$await(promise)
                    .$then((v: string) => html`<span>${v}</span>`)
                    .$pending(() => html`<span>Loading...</span>`)
                    .$catch((err: Error) => html`<span>Error: ${err.message}</span>`)}
            </div>`;

        mount(Comp, { to: document.querySelector('#app') });

        // initially pending
        expect(document.querySelector('span')?.textContent).toBe('Loading...');

        // reject promise
        rejectFn?.(new Error('Fail!'));
        await new Promise((resolve) => setTimeout(resolve, 0));

        const span = document.querySelector('span');
        expect(span?.textContent).toBe('Error: Fail!');
    });

    test('should replace pending nodes on resolution', async () => {
        let resolveFn: ((value: string) => void) | undefined;
        const promise: Promise<string> = new Promise((resolve) => {
            resolveFn = resolve;
        });

        const Comp = () =>
            html`<div>
                ${$await(promise)
                    .$then((v: string) => html`<span class="done">${v}</span>`)
                    .$pending(() => html`<span class="pending">Loading...</span>`)}
            </div>`;

        mount(Comp, { to: document.querySelector('#app') });

        const pendingNode = document.querySelector('.pending');
        expect(pendingNode).toBeDefined();

        resolveFn?.('Done');
        await Promise.resolve();

        const doneNode = document.querySelector('.done');
        expect(doneNode).toBeDefined();
        expect(doneNode?.textContent).toBe('Done');

        // ensure pending node is gone
        expect(document.querySelector('.pending')).toBeNull();
    });

    test('should ignore resolution if root is disconnected', async () => {
        let resolveFn: ((value: string) => void) | undefined;
        const promise: Promise<string> = new Promise((resolve) => {
            resolveFn = resolve;
        });

        const Comp = () =>
            html`<div>
                ${$await(promise)
                    .$then((v: string) => html`<span class="done">${v}</span>`)
                    .$pending(() => html`<span class="pending">Loading...</span>`)}
            </div>`;

        const root = document.createElement('div');
        document.body.append(root);
        mount(Comp, { to: root });

        // remove root before resolution
        root.remove();

        resolveFn?.('Done');
        await Promise.resolve();

        // nothing should have been added to DOM
        expect(document.body.contains(document.querySelector('.done'))).toBe(false);
    });

    test('should render $suspend pending state initially', () => {
        const Comp = () =>
            html`<div>
                ${$suspend(async () => html`<span>Done</span>`, {
                    pending: () => html`<span>Loading...</span>`,
                    error: (err) => html`<span>Error: ${err?.toString()}</span>`,
                })}
            </div>`;

        mount(Comp, { to: document.querySelector('#app') });
        const span = document.querySelector('span');
        expect(span).toBeDefined();
        expect(span?.textContent).toBe('Loading...');
    });

    test('should render resolved value and remove pending', async () => {
        let resolveFn: ((value: string) => void) | undefined;
        const promise: Promise<string> = new Promise((resolve) => {
            resolveFn = resolve;
        });

        const Comp = () =>
            html`<div>
                ${$suspend(() => promise.then((v) => html`<span class="done">${v}</span>`), {
                    pending: () => html`<span class="pending">Loading...</span>`,
                    error: (err) => html`<span class="error">${err?.toString()}</span>`,
                })}
            </div>`;

        mount(Comp, { to: document.querySelector('#app') });

        // initially pending
        expect(document.querySelector('.pending')?.textContent).toBe('Loading...');

        // resolve promise
        resolveFn?.('Done');
        await new Promise((r) => setTimeout(r, 0));

        const doneNode = document.querySelector('.done');
        expect(doneNode).toBeDefined();
        expect(doneNode?.textContent).toBe('Done');

        // pending node removed
        expect(document.querySelector('.pending')).toBeNull();
    });

    test('should render error state on rejection', async () => {
        let rejectFn: ((error: Error) => void) | undefined;
        const promise: Promise<string> = new Promise((_, reject) => {
            rejectFn = reject;
        });

        const Comp = () =>
            html`<div>
                ${$suspend(() => promise.then((v) => html`<span class="done">${v}</span>`), {
                    pending: () => html`<span class="pending">Loading...</span>`,
                    error: (err) => html`<span class="error">${err instanceof Error ? err.message : err}</span>`,
                })}
            </div>`;

        mount(Comp, { to: document.querySelector('#app') });

        expect(document.querySelector('.pending')?.textContent).toBe('Loading...');

        // reject promise
        rejectFn?.(new Error('Fail!'));
        await new Promise((r) => setTimeout(r, 0));

        const errorNode = document.querySelector('.error');
        expect(errorNode).toBeDefined();
        expect(errorNode?.textContent).toBe('Fail!');

        // pending node removed
        expect(document.querySelector('.pending')).toBeNull();
    });

    test('should ignore resolution if root is disconnected', async () => {
        let resolveFn: ((value: string) => void) | undefined;
        const promise: Promise<string> = new Promise((resolve) => {
            resolveFn = resolve;
        });

        const root = document.createElement('div');
        document.body.append(root);

        const Comp = () =>
            html`<div>
                ${$suspend(() => promise.then((v) => html`<span class="done">${v}</span>`), {
                    pending: () => html`<span class="pending">Loading...</span>`,
                    error: (err) => html`<span class="error">${err?.toString()}</span>`,
                })}
            </div>`;

        mount(Comp, { to: root });

        root.remove();

        resolveFn?.('Done');
        await new Promise((r) => setTimeout(r, 0));

        expect(document.body.contains(document.querySelector('.done'))).toBe(false);
    });
});
