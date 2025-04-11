/** @format */

import { describe, expect, test } from 'bun:test';
import { combined } from './combined';
import { grain } from './grain';

describe('Combined', () => {
    test('should combine multiple grains into a single grain', () => {
        const count = grain(0);
        const text = grain('Text');
        const c = combined([count, text]);

        expect(c()).toEqual([0, 'Text']);
    });

    test('should update when one of the source grains are updated', () => {
        const count = grain(0);
        const text = grain('A');
        const c = combined([count, text]);

        count.set(10);
        expect(c()).toEqual([10, 'A']);
        text.set('B');
        expect(c()).toEqual([10, 'B']);
    });

    test('should notify consumers when any of the source grains change', () => {
        const count = grain(0);
        const text = grain('A');

        const c = combined([count, text]);

        let notifiedValue: [number, string] = [count(), text()];
        expect(notifiedValue).toEqual([0, 'A']);

        c.subscribe((value) => {
            notifiedValue = value;
        });

        count.set(10);
        expect(notifiedValue).toEqual([10, 'A']);

        text.set('B');
        expect(notifiedValue).toEqual([10, 'B']);
    });

    test('should handle combining more than two grains', () => {
        const count = grain(0);
        const text = grain('A');
        const bool = grain(true);
        const arr = grain([0, 'C']);

        const c = combined([count, text, bool, arr]);
        expect(c()).toEqual([0, 'A', true, [0, 'C']]);

        count.set(10);
        expect(c()).toEqual([10, 'A', true, [0, 'C']]);

        text.set('B');
        expect(c()).toEqual([10, 'B', true, [0, 'C']]);

        bool.set(false);
        expect(c()).toEqual([10, 'B', false, [0, 'C']]);

        arr.set([1, 'D', 'E']);
        expect(c()).toEqual([10, 'B', false, [1, 'D', 'E']]);
    });
});
