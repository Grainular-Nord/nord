/** @format */

import { describe, expect, test } from 'bun:test';
import { flattened } from './flattened';
import { grain } from './grain';

describe('Flattened', () => {
    test('should unwrap the initial value of a nested grain', () => {
        const inner = grain(10);
        const outer = grain(inner);
        const flat = flattened(outer);

        expect(flat()).toBe(10);
    });

    test('should update when the value of the inner grain changes', () => {
        const inner = grain('A');
        const outer = grain(inner);
        const flat = flattened(outer);

        expect(flat()).toBe('A');

        inner.set('B');
        expect(flat()).toBe('B');
    });

    test('should update when the outer grain switches to a new inner grain', () => {
        const inner1 = grain(1);
        const inner2 = grain(2);
        const outer = grain(inner1);
        const flat = flattened(outer);

        expect(flat()).toBe(1);

        // Switch the outer grain to point to inner2
        outer.set(inner2);
        expect(flat()).toBe(2);
    });

    test('should notify subscribers when inner or outer grains change', () => {
        const inner1 = grain(10);
        const outer = grain(inner1);
        const flat = flattened(outer);

        let notifiedValue = flat();
        flat.subscribe((val) => {
            notifiedValue = val;
        });

        // Test inner change notification
        inner1.set(20);
        expect(notifiedValue).toBe(20);

        // Test outer switch notification
        const inner2 = grain(30);
        outer.set(inner2);
        expect(notifiedValue).toBe(30);

        // Test new inner change notification
        inner2.set(40);
        expect(notifiedValue).toBe(40);
    });

    test('should correctly unsubscribe from the old inner grain when switching', () => {
        const inner1 = grain('A');
        const inner2 = grain('B');
        const outer = grain(inner1);
        const flat = flattened(outer);

        // Subscribe to track updates
        let updateCount = 0;
        flat.subscribe(() => {
            updateCount++;
        });

        // Initial check
        expect(flat()).toBe('A');

        // Switch to inner2
        outer.set(inner2);
        expect(flat()).toBe('B');

        // Reset counter to track only subsequent updates
        updateCount = 0;

        // Modifying inner1 should NO LONGER affect flat
        inner1.set('Modified A');
        expect(flat()).toBe('B'); // Value should remain B
        expect(updateCount).toBe(0); // Should not have triggered a subscription update

        // Modifying inner2 SHOULD affect flat
        inner2.set('Modified B');
        expect(flat()).toBe('Modified B');
        expect(updateCount).toBe(1);
    });

    test('should return a readonly grain', () => {
        const inner = grain(1);
        const outer = grain(inner);
        const flat = flattened(outer);

        // Check that 'set' is not exposed on the returned object
        // Depending on your readonly implementation, this might be undefined
        // or the types will simply error. At runtime:
        expect('set' in flat).toBeFalse();
    });
});
