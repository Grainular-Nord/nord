import type { ComponentFragment } from '@grainular/nord';

export const isComponentFragment = (value: unknown): value is ComponentFragment => {
    return Boolean(
        value &&
        typeof value === 'object' &&
        'render' in value &&
        typeof value.render === 'function' &&
        'hydrate' in value &&
        typeof value.hydrate === 'function',
    );
};
