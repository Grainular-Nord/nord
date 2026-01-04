import type { WritableGrain } from '@grainular/grains';
import { createDirective } from '@grainular/nord';

export const trackTextLength = (length: WritableGrain<number>) => {
    return createDirective((node) => {
        const handler = () => {
            if (node instanceof HTMLTextAreaElement) {
                length.set(node.value.length);
            }
        };

        node.addEventListener('input', handler);

        return () => {
            return node.removeEventListener('input', handler);
        };
    });
};
