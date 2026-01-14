import { beforeEach, expect, test } from 'bun:test';
import { setup } from './setup.spec';

beforeEach(() => {
    setup();
});

test('DOM primitives exist', () => {
    expect(document.createElement).toBeDefined();
    expect(document.createTreeWalker).toBeDefined();
    expect(document.createElement('template').content).toBeDefined();
    expect(globalThis.MutationObserver).toBeDefined();
});
