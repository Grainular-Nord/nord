/** @format */

import { describe, expect, test } from 'bun:test';
import { grain } from './grain';

describe('A Grain', () => {
    test('should be initialized with a given start value', () => {
        const count = grain(10);
        expect(count()).toBe(10);
    });

    test('should be updated by calling the `set` method', () => {
        const count = grain(10);
        count.set(20);
        expect(count()).toBe(20);
    });

    test('should notify it`s subscribers when the value is updated', () => {
        const count = grain(10);
        let notifiedValue: number = 0;
        const unsubscribe = count.subscribe((value: number) => {
            notifiedValue = value;
        });

        count.set(30);
        expect(notifiedValue).toBe(30);

        // Unsubscribe and ensure no further updates are received
        unsubscribe();
        count.set(50);
        expect(notifiedValue).toBe(30); // Value should not change after unsubscribe
    });

    test('should not notify it`s subscribers if the value does not change', () => {
        const count = grain(10);
        let notificationCount: number = 0;

        count.subscribe(() => {
            notificationCount++;
        });

        count.set(10); // Same value
        expect(notificationCount).toBe(0); // No notification should be sent
    });

    test('should be updating the value based on the current value when using the `update` method', () => {
        const count = grain(10);
        count.update((value) => value + 5);
        expect(count()).toBe(15);
    });
});
