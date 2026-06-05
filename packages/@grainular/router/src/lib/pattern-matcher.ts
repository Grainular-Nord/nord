import type { Route } from './route';

export const registry = new Map<URLPattern, Route>();

export const createPatternMatcher = (base: string, routes: Route[]) => {
    for (const route of routes) {
        const normalized = new URL(route.path, `http://localhost${base}`);
        registry.set(new URLPattern({ pathname: normalized.pathname }), route);
    }

    return {
        match: (url: URL) => {
            return [...registry.entries()].find(([pattern]) => pattern.test(url)) ?? null;
        },
    };
};
