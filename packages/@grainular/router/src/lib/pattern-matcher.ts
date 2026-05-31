import type { Route } from './route';

export const createPatternMatcher = (base: string, routes: Route[]) => {
    const registry = new Map<URLPattern, Route>(
        routes.map((route) => {
            const normalized = new URL(route.path, `http://localhost${base}`);
            return [new URLPattern({ pathname: normalized.pathname }), route];
        }),
    );

    return {
        registry,
        match: (url: URL) => {
            return [...registry.entries()].find(([pattern]) => pattern.test(url)) ?? null;
        },
    };
};
