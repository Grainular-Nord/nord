import { grain, readonly } from '@grainular/grains';
import type { ComponentFragment } from '@grainular/nord';
import { getFragment } from './fragments';
import { resolveHooks } from './hooks/resolve-hook';
import { getPathParamGroup } from './params/get-path-param-group';
import { parameterized } from './params/parameterized';
import { createPatternMatcher } from './pattern-matcher';
import type { Route } from './route';

type RouterStateSnapshot = {
    path: string | null;
    resolved: string | null;
    component: ComponentFragment | null;
    route: Route | null;
};

const isRouterEvent = (event: NavigateEvent) => {
    return event.canIntercept && !event.hashChange && !event.downloadRequest && !event.formData;
};

export const createRouter = (base: string, routes: Route[]) => {
    const params = grain({});
    const query = grain<Record<string, string>>({});

    const { match } = createPatternMatcher(base, routes);
    const state = grain<RouterStateSnapshot>({ resolved: null, component: null, path: null, route: null });

    const getURLState = (url: URL) => {
        const [pattern, route] = match(url) ?? [];
        if (!pattern || !route) return null;

        return {
            params: getPathParamGroup(pattern.exec(url)),
            query: Object.fromEntries(url.searchParams),
            resolved: pattern.pathname,
            path: url.pathname,
            pattern: pattern,
            route: route,
            url: url,
        };
    };

    const setRouterState = async (next: NonNullable<ReturnType<typeof getURLState>>) => {
        const { pattern, route, params: matchedParams, query: matchedQuery, url } = next;

        // Run pre hooks
        const preHooks = (route.use ?? []).filter((hook) => hook.run === 'pre');
        const canNavigate = await resolveHooks(preHooks, next);

        if (!canNavigate) return;

        const fragment = getFragment(await route.component());
        params.set(matchedParams);
        query.set(matchedQuery);
        state.update(() => {
            return {
                route,
                component: fragment,
                resolved: pattern.pathname,
                path: url.pathname,
            };
        });
    };

    navigation.addEventListener('navigate', (event) => {
        if (!isRouterEvent(event)) return;
        const url = new URL(event.destination.url);

        const nextState = getURLState(url);
        if (!nextState) return;
        let canNavigate = true;

        event.intercept({
            scroll: 'after-transition',
            precommitHandler: async () => {
                // Run all post hooks of the previous route
                const postHooks = (state().route?.use ?? []).filter((hook) => hook.run === 'post');
                canNavigate = await resolveHooks(postHooks, { ...state(), params: params(), query: query() });

                // Run pre hooks
                const preHooks = (nextState.route.use ?? []).filter((hook) => hook.run === 'pre');
                canNavigate = await resolveHooks(preHooks, nextState);
            },
            handler: async () => {
                // Cancel navigation based on hook result
                if (!canNavigate) return;

                // update router state & post hooks
                const { pattern, route, params: matchedParams, query: matchedQuery } = nextState;
                const fragment = getFragment(await route.component());
                params.set(matchedParams);
                query.set(matchedQuery);
                state.update(() => {
                    return {
                        route,
                        component: fragment,
                        resolved: pattern.pathname,
                        path: url.pathname,
                    };
                });
            },
        });
    });

    // Get the initial route set and set the routerState
    const current = getURLState(new URL(navigation.currentEntry?.url ?? ''));
    if (current) setRouterState(current);

    return {
        params: parameterized(params),
        query: readonly(query),
        state: readonly(state),
        match,
        base,
    };
};

export type Router = Omit<ReturnType<typeof createRouter>, 'match' | 'params' | 'query'>;
