import type { ComponentFragment } from '@grainular/nord';
import type { Route } from './route';

export const fragmentCache = new Map<URLPattern, ComponentFragment>();

export const getFragment = (resolved: Awaited<ReturnType<Route['component']>>) => {
    if ('default' in resolved) {
        return resolved.default();
    }

    if (typeof resolved === 'function') {
        return resolved();
    }

    return resolved;
};
