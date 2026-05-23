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

        inner1.set(20);
        expect(notifiedValue).toBe(20);

        const inner2 = grain(30);
        outer.set(inner2);
        expect(notifiedValue).toBe(30);

        inner2.set(40);
        expect(notifiedValue).toBe(40);
    });

    test('should correctly unsubscribe from the old inner grain when switching', () => {
        const inner1 = grain('A');
        const inner2 = grain('B');
        const outer = grain(inner1);
        const flat = flattened(outer);

        let updateCount = 0;
        flat.subscribe(() => {
            updateCount++;
        });

        expect(flat()).toBe('A');

        outer.set(inner2);
        expect(flat()).toBe('B');

        updateCount = 0;

        inner1.set('Modified A');
        expect(flat()).toBe('B');
        expect(updateCount).toBe(0);

        inner2.set('Modified B');
        expect(flat()).toBe('Modified B');
        expect(updateCount).toBe(1);
    });

    test('should stop notifying after unsubscribe', () => {
        const inner = grain(1);
        const outer = grain(inner);
        const flat = flattened(outer);

        let updateCount = 0;
        const unsubscribe = flat.subscribe(() => {
            updateCount++;
        });

        inner.set(2);
        expect(updateCount).toBe(1);

        unsubscribe();

        inner.set(3);
        outer.set(grain(99));
        expect(updateCount).toBe(1); // No further notifications
    });

    test('should return a readonly grain', () => {
        const inner = grain(1);
        const outer = grain(inner);
        const flat = flattened(outer);

        expect('set' in flat).toBeFalse();
    });
});
