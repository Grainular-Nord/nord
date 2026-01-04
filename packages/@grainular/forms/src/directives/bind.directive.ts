import type { WritableGrain } from '@grainular/grains';
import { createDirective } from '@grainular/nord';
import { getBinding } from '../lib/value-binding';

export const bind = <V>(value: WritableGrain<V>, event: 'change' | 'input' | 'blur' = 'input') => {
    return createDirective((node) => {
        const { get, set } = getBinding(node);

        // Setter logic
        set(value());
        const cleanup = value.subscribe((value) => set(value));

        // Handler logic
        const handler = () => value.set(get() as V);
        node.addEventListener(event, handler);

        return () => {
            node.removeEventListener(event, handler);
            cleanup();
        };
    });
};
