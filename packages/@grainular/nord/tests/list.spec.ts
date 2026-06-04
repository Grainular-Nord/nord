import { grain } from '@grainular/grains';
import { beforeEach, describe, expect, test } from 'bun:test';
import { $each, html, mount } from '../src';
import { setup } from './setup.spec';

describe('[Nørd Runtime] Lists', () => {
    beforeEach(() => setup());

    test('should create and render a list of static items', () => {
        // Setup the list items and component
        const items = [{ name: 'Test 1' }, { name: 'Test 2' }, { name: 'Test 3' }];
        const List = () => {
            return html`<ul>
                ${$each(() => items).$as((item) => {
                    return html`<li>${item.name}</li>`;
                })}
            </ul>`;
        };

        mount(List, { to: document.querySelector('#app') });

        // Assert that the list was rendered correctly
        const listElement = document.querySelector('#app')?.firstElementChild;
        expect(listElement?.tagName).toBe('UL');

        // Assert that the correct amount of children is present
        expect(listElement?.childElementCount).toBe(3);
        expect(Array.from(listElement?.children ?? [])).toBeArray();

        // Assert the individual elements
        expect(listElement?.children.item(0)?.tagName).toBe('LI');
        expect(listElement?.children.item(0)?.textContent).toBe('Test 1');

        expect(listElement?.children.item(1)?.tagName).toBe('LI');
        expect(listElement?.children.item(1)?.textContent).toBe('Test 2');

        expect(listElement?.children.item(2)?.tagName).toBe('LI');
        expect(listElement?.children.item(2)?.textContent).toBe('Test 3');
    });

    test('should create and render a list of dynamic items', () => {
        // Setup the list items and component
        const items = grain([{ name: 'Test 1' }, { name: 'Test 2' }, { name: 'Test 3' }]);
        const List = () => {
            return html`<ul>
                ${$each(items).$as((item) => {
                    return html`<li>${item.name}</li>`;
                })}
            </ul>`;
        };

        mount(List, { to: document.querySelector('#app') });

        // Assert that the list was rendered correctly
        const listElement = document.querySelector('#app')?.firstElementChild;
        expect(listElement?.tagName).toBe('UL');

        // Assert that the correct amount of children is present
        expect(listElement?.childElementCount).toBe(3);
        expect(Array.from(listElement?.children ?? [])).toBeArray();

        // Assert the individual elements
        expect(listElement?.children.item(0)?.tagName).toBe('LI');
        expect(listElement?.children.item(0)?.textContent).toBe('Test 1');

        expect(listElement?.children.item(1)?.tagName).toBe('LI');
        expect(listElement?.children.item(1)?.textContent).toBe('Test 2');

        expect(listElement?.children.item(2)?.tagName).toBe('LI');
        expect(listElement?.children.item(2)?.textContent).toBe('Test 3');
    });

    test('should create, render and update a list of dynamic items', () => {
        // Setup the list items and component
        const items = grain([{ name: 'Test 1' }]);
        const List = () => {
            return html`<ul>
                ${$each(items).$as((item) => {
                    return html`<li>${item.name}</li>`;
                })}
            </ul>`;
        };

        mount(List, { to: document.querySelector('#app') });

        // Assert that the list was rendered correctly
        const listElement = document.querySelector('#app')?.firstElementChild;
        expect(listElement?.tagName).toBe('UL');

        // Assert that the correct amount of children is present
        expect(listElement?.childElementCount).toBe(1);
        expect(Array.from(listElement?.children ?? [])).toBeArray();
        const firstElement = listElement?.children.item(0);
        // Assert the individual elements
        expect(listElement?.children.item(0)?.tagName).toBe('LI');
        expect(listElement?.children.item(0)?.textContent).toBe('Test 1');

        // Add an item to the list
        items.update((current) => [...current, { name: 'Test 2' }]);

        // Assert that the correct amount of children is present
        expect(listElement?.childElementCount).toBe(2);
        expect(Array.from(listElement?.children ?? [])).toBeArray();

        // Assert node stability
        expect(firstElement).toBe(listElement?.children.item(0));
        expect(firstElement).not.toBe(listElement?.children.item(1));

        // Assert the individual elements
        expect(listElement?.children.item(0)?.tagName).toBe('LI');
        expect(listElement?.children.item(0)?.textContent).toBe('Test 1');
        expect(listElement?.children.item(1)?.tagName).toBe('LI');
        expect(listElement?.children.item(1)?.textContent).toBe('Test 2');
    });

    test('should not update on mutation', () => {
        // Setup the list items and component
        const items = grain([{ name: 'Test 1' }]);
        const List = () => {
            return html`<ul>
                ${$each(items).$as((item) => {
                    return html`<li>${item.name}</li>`;
                })}
            </ul>`;
        };

        mount(List, { to: document.querySelector('#app') });

        // Assert that the list was rendered correctly
        const listElement = document.querySelector('#app')?.firstElementChild;
        expect(listElement?.tagName).toBe('UL');

        // Assert that the correct amount of children is present
        expect(listElement?.childElementCount).toBe(1);
        expect(Array.from(listElement?.children ?? [])).toBeArray();

        // Assert the individual elements
        expect(listElement?.children.item(0)?.tagName).toBe('LI');
        expect(listElement?.children.item(0)?.textContent).toBe('Test 1');

        // Add an item to the list
        items.update((current) => {
            current[0].name = 'Test 2';
            return current;
        });

        // Assert that the correct amount of children is present
        expect(listElement?.childElementCount).toBe(1);
        expect(Array.from(listElement?.children ?? [])).toBeArray();

        // Assert the individual elements
        expect(listElement?.children.item(0)?.tagName).toBe('LI');
        expect(listElement?.children.item(0)?.textContent).toBe('Test 1');
    });

    test('should reorder items without recreating nodes', () => {
        const a = { id: 1, name: 'A' };
        const b = { id: 2, name: 'B' };
        const c = { id: 3, name: 'C' };

        const items = grain([a, b, c]);

        const List = () => html`
        <ul>
            ${$each(items)
                .$withKey((item) => item.id)
                .$as((item) => html`<li>${item.name}</li>`)}
        </ul>
    `;

        mount(List, { to: document.querySelector('#app') });

        const list = document.querySelector('ul');
        const [aEl, bEl, cEl] = Array.from(list?.children ?? []);

        items.set([c, a, b]);

        const [cEl2, aEl2, bEl2] = Array.from(list?.children ?? []);

        expect(aEl2).toBe(aEl);
        expect(bEl2).toBe(bEl);
        expect(cEl2).toBe(cEl);
    });

    test('should remove nodes when items are deleted', () => {
        const items = grain([
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
            { id: 3, name: 'C' },
        ]);

        const List = () => html`
        <ul>
            ${$each(items)
                .$withKey((i) => i.id)
                .$as((i) => html`<li>${i.name}</li>`)}
        </ul>
    `;

        mount(List, { to: document.querySelector('#app') });

        const list = document.querySelector('ul');
        const [, b] = Array.from(list?.children ?? []);

        items.set([
            { id: 1, name: 'A' },
            { id: 3, name: 'C' },
        ]);

        expect(list?.childElementCount).toBe(2);
        expect(Array.from(list?.children ?? [])).not.toContain(b);
    });

    test('should remove all nodes when list becomes empty', () => {
        const items = grain([{ name: 'A' }]);

        const List = () => html`
        <ul>
            ${$each(items).$as((i) => html`<li>${i.name}</li>`)}
        </ul>
    `;

        mount(List, { to: document.querySelector('#app') });

        const list = document.querySelector('ul');
        expect(list?.childElementCount).toBe(1);

        items.set([]);

        expect(list?.childElementCount).toBe(0);
    });

    test('should replace node when identity changes', () => {
        const items = grain([{ name: 'A' }]);

        const List = () => html`
        <ul>
            ${$each(items).$as((i) => html`<li>${i.name}</li>`)}
        </ul>
    `;

        mount(List, { to: document.querySelector('#app') });

        const list = document.querySelector('ul');
        const first = list?.children[0];

        items.set([{ name: 'B' }]);

        const next = list?.children[0];

        expect(next).not.toBe(first);
        expect(next?.textContent).toBe('B');
    });

    test('$each updates when used as first top-level node of a hydrated fragment', () => {
        const items = grain([
            { id: 1, title: 'A' },
            { id: 2, title: 'B' },
        ]);

        const List = () => html`
            ${$each(items)
                .$withKey((item) => item.id)
                .$as((item) => html`<div>${item.title}</div>`)}
        `;

        mount(List, { to: document.querySelector('#app') });
        expect(document.querySelector('#app')?.textContent.trim()).toBe('AB');

        expect(() => {
            items.set([
                { id: 2, title: 'B' },
                { id: 1, title: 'A' },
            ]);
        }).not.toThrow();

        expect(document.querySelector('#app')?.textContent.trim()).toBe('BA');
    });
});
