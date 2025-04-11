/** @format */

import { describe, expect, test } from 'bun:test';
import { grain } from './grain';
import { readonly } from './readonly';

describe('Readonly', () => {
    test('should return the same value as it`s source grain', () => {
        const source = grain<number>(10);
        const count = readonly(source);

        expect(count()).toBe(10);
    });

    test('should not allow setting the value of the grain', () => {
        const source = grain<number>(10);
        const count = readonly(source);

        // Even though TypeScript won't allow calling set/update on a readonly grain, cast to `any` to ensure it's tested.
        ///@ts-expect-error
        expect(() => count.set(20)).toThrow();
        ///@ts-expect-error
        expect(() => count.update((value: number) => value + 5)).toThrow();
    });

    test('should mirror the value of the source grain when subscribing', () => {
        const source = grain<number>(10);
        const count = readonly(source);

        let notifiedValue = 0;
        count.subscribe((value: number) => {
            notifiedValue = value;
        });

        source.set(15);
        expect(notifiedValue).toBe(15);
    });

    test('should allow for multiple subscribers', () => {
        const source = grain<number>(5);
        const count = readonly(source);

        let subscriberOneValue = 0;
        let subscriberTwoValue = 0;

        count.subscribe((value) => (subscriberOneValue = value));
        count.subscribe((value) => (subscriberTwoValue = value));

        source.set(20);
        expect(subscriberOneValue).toBe(20);
        expect(subscriberTwoValue).toBe(20);
    });
});
