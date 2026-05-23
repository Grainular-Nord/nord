/** @format */

import { describe, expect, test } from 'bun:test';
import { derived } from './derived';
import { grain } from './grain';

describe('Derived', () => {
    test('should derive a value from the source grain', () => {
        const source = grain<number>(10);
        const doubled = derived(source, (c) => c * 2);

        expect(doubled()).toBe(20);
    });

    test('should not allow setting the value of the grain', () => {
        const source = grain<number>(10);
        const doubled = derived(source, (c) => c * 2);

        // Even though TypeScript won't allow calling set/update on a readonly grain, cast to `any` to ensure it's tested.
        ///@ts-expect-error
        expect(() => doubled.set(20)).toThrow();
        ///@ts-expect-error
        expect(() => doubled.update((value: number) => value + 5)).toThrow();
    });

    test('should derive the value of the source grain when source is updated', () => {
        const source = grain<number>(10);
        const doubled = derived(source, (count) => count * 2);

        let notifiedValue = 0;
        doubled.subscribe((value: number) => {
            notifiedValue = value;
        });

        source.set(15);
        expect(notifiedValue).toBe(30);
    });

    test('should allow for multiple subscribers', () => {
        const source = grain<number>(5);
        const doubled = derived(source, (count) => count * 2);

        let subscriberOneValue = 0;
        let subscriberTwoValue = 0;

        doubled.subscribe((value) => {
            subscriberOneValue = value;
        });
        doubled.subscribe((value) => {
            subscriberTwoValue = value;
        });

        source.set(20);
        expect(subscriberOneValue).toBe(40);
        expect(subscriberTwoValue).toBe(40);
    });
});
