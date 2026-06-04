import type { Route } from './route';

export const getFragment = (resolved: Awaited<ReturnType<Route['component']>>) => {
    if ('default' in resolved) {
        return resolved.default();
    }

    if (typeof resolved === 'function') {
        return resolved();
    }

    return resolved;
};
