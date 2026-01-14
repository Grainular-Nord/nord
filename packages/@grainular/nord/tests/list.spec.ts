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
});
