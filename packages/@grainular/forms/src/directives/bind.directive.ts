import type { WritableGrain } from '@grainular/grains';
import { createDirective } from '@grainular/nord';

export const bind = (source: WritableGrain<string>) => {
    return createDirective((node) => {
        (node as HTMLInputElement).value = source();
        const handler = (event: Event) => {
            const target = event.target as HTMLInputElement;
            source.set(target.value);
        };

        const unsubscribe = source.subscribe((value) => {
            (node as HTMLInputElement).value = value;
        });

        node.addEventListener('input', handler);
        return () => {
            node.removeEventListener('input', handler);
            unsubscribe();
        };
    });
};
