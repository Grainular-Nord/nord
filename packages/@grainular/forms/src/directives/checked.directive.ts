import { createDirective } from '@grainular/core';
import type { WritableGrain } from '@grainular/grains';

export const checked = (source: WritableGrain<boolean>) => {
    return createDirective((node) => {
        (node as HTMLInputElement).checked = source();
        const handler = (event: Event) => {
            const target = event.target as HTMLInputElement;
            source.set(target.checked);
        };

        const unsubscribe = source.subscribe((value) => {
            (node as HTMLInputElement).checked = value;
        });

        node.addEventListener('change', handler);
        return () => {
            node.removeEventListener('change', handler);
            unsubscribe();
        };
    });
};
