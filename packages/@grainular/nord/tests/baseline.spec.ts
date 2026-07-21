import { beforeEach, expect, test } from 'vitest';
import { setup } from './setup';

beforeEach(() => {
    setup();
});

test('DOM primitives exist', () => {
    expect(document.createElement).toBeDefined();
    expect(document.createTreeWalker).toBeDefined();
    expect(document.createElement('template').content).toBeDefined();
    expect(globalThis.MutationObserver).toBeDefined();
});
