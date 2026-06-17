import { grain, readonly } from '@grainular/grains';
import type { ComponentFragment } from '@grainular/nord';
import { getFragment } from './fragments';
import { resolveHooks } from './hooks/resolve-hook';
import { getPathParamGroup } from './params/get-path-param-group';
import { parameterized } from './params/parameterized';
import { createPatternMatcher } from './pattern-matcher';
import { redirector } from './redirector';
import type { Route } from './route';

export type RouterStateSnapshot = {
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

    const isOwnRoute = (route: Route) => {
        return routes.some((ownRoute) => ownRoute === route);
    };

    const checkForNavigationViability = (nextState: ReturnType<typeof getURLState>) => {
        if (!nextState || !isOwnRoute(nextState.route))
            return {
                canNavigate: false,
            };

        let canNavigate = true;
        const redirectController = redirector();
        const redirect = (path: string) => redirectController.add(path);

        // Run all post hooks of the previous route
        const postHooks = (state().route?.use ?? []).filter((hook) => hook.run === 'post');
        canNavigate = resolveHooks(postHooks, { ...state(), params: params(), query: query(), redirect });

        // Run pre hooks
        const preHooks = (nextState.route.use ?? []).filter((hook) => hook.run === 'pre');
        canNavigate = canNavigate && resolveHooks(preHooks, { ...nextState, redirect });

        return {
            canNavigate,
            redirects: redirectController,
        };
    };

    const runNavigationProcedure = async (nextState: NonNullable<ReturnType<typeof getURLState>>) => {
        // update router state & post hooks
        const { pattern, route, params: matchedParams, query: matchedQuery } = nextState;
        const fragment = getFragment(await route.component());

        const loadHooks = (route.use ?? []).filter((hook) => hook.run === 'load');
        for (const hook of loadHooks) {
            hook.handler({ ...nextState });
        }

        params.set(matchedParams);
        query.set(matchedQuery);
        state.update(() => {
            return {
                route,
                component: fragment,
                resolved: pattern.pathname,
                path: nextState.url.pathname,
            };
        });
    };

    const initializeRouterState = () => {
        // Create the initial router state
        const nextState = getURLState(new URL(navigation.currentEntry?.url ?? ''));
        const { canNavigate, redirects } = checkForNavigationViability(nextState);

        if (!nextState || !canNavigate || redirects?.hasRedirects()) {
            return redirects?.execute();
        }

        runNavigationProcedure(nextState);
    };

    let attached = false;
    const attach = () => {
        if (attached) return;
        attached = true;

        navigation.addEventListener('navigate', (event) => {
            if (!isRouterEvent(event)) return;
            const url = new URL(event.destination.url);

            const nextState = getURLState(url);
            const { canNavigate, redirects } = checkForNavigationViability(nextState);

            // Cancel navigation based on hook result
            // We redirect to the first stored redirect
            // handler, and loose all others
            if (!nextState || !canNavigate || redirects?.hasRedirects()) {
                return redirects?.execute(event);
            }

            event.intercept({
                scroll: 'after-transition',
                handler: async () => {
                    await runNavigationProcedure(nextState);
                },
            });
        });
        initializeRouterState();
    };

    return {
        params: parameterized(params),
        query: readonly(query),
        state: readonly(state),
        match,
        base,
        attach,
    };
};

export type Router = Omit<ReturnType<typeof createRouter>, 'params' | 'query'>;
