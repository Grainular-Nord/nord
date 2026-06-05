import { grain, readonly } from '@grainular/grains';
import type { ComponentFragment } from '@grainular/nord';
import { getFragment } from './fragments';
import { resolveHooks } from './hooks/resolve-hook';
import { getPathParamGroup } from './params/get-path-param-group';
import { parameterized } from './params/parameterized';
import { createPatternMatcher } from './pattern-matcher';
import { redirector } from './redirector';
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

        const redirects = redirector();
        const redirect = (path: string) => redirects.add(path);

        // Run pre hooks
        const preHooks = (route.use ?? []).filter((hook) => hook.run === 'pre');
        const canNavigate = resolveHooks(preHooks, { ...next, redirect });

        // Cancel navigation based on hook result
        // We redirect to the first stored redirect
        // handler, and loose all others
        if (!canNavigate || redirects.hasRedirects()) {
            return redirects.execute();
        }

        // Run the load hooks
        const loadHooks = (route.use ?? []).filter((h) => h.run === 'load');
        resolveHooks(loadHooks, { ...next, redirect });

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

    const isOwnRoute = (route: Route) => {
        return routes.some((ownRoute) => ownRoute === route);
    };

    navigation.addEventListener('navigate', (event) => {
        if (!isRouterEvent(event)) return;
        const url = new URL(event.destination.url);

        const nextState = getURLState(url);
        if (!nextState || !isOwnRoute(nextState.route)) return;
        let canNavigate = true;
        const redirects = redirector();
        const redirect = (path: string) => redirects.add(path);

        // Run all post hooks of the previous route
        const postHooks = (state().route?.use ?? []).filter((hook) => hook.run === 'post');
        canNavigate = resolveHooks(postHooks, { ...state(), params: params(), query: query(), redirect });

        // Run pre hooks
        const preHooks = (nextState.route.use ?? []).filter((hook) => hook.run === 'pre');
        canNavigate = canNavigate && resolveHooks(preHooks, { ...nextState, redirect });

        // Cancel navigation based on hook result
        // We redirect to the first stored redirect
        // handler, and loose all others
        if (!canNavigate || redirects.hasRedirects()) {
            return redirects.execute(event);
        }

        event.intercept({
            scroll: 'after-transition',
            // As the handler is not yes baseline as of mid 2026, we cannot
            // use the precommitController. Without it, pre and post hooks need
            // to be resolved synchronously.
            // precommitHandler: async () => {},
            handler: async () => {
                // update router state & post hooks
                const { pattern, route, params: matchedParams, query: matchedQuery } = nextState;
                const fragment = getFragment(await route.component());

                const loadHooks = (route.use ?? []).filter((h) => h.run === 'load');
                resolveHooks(loadHooks, { ...nextState, redirect });

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
