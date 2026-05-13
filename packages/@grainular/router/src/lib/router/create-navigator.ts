import type { Silo } from '@grainular/silo';
import type { Navigator } from '../../types/navigator';
import type { NavigatorState } from '../../types/navigator-state';
import type { GuardContext } from '../../types/route-guard';
import type { RouterState } from '../../types/router-state';
import { normalizeRoute } from '../../utils/normalize-route';
import { canActivateRoute, canDeactivateRoute } from '../guards/guard-executor';
import type { HistoryManager } from '../history/history-manager';
import type { RouteMatcher } from './create-route-matcher';
import { resolveComponent } from './resolve-component';

type CreateNavigatorOptions = {
    match: RouteMatcher['match'];
    state: Silo<RouterState>;
    history: HistoryManager;
};

type NavigatorResult = {
    navigate: Navigator;
    syncToRoute: (path: string) => Promise<void>;
};

export const createNavigator = ({ match, state, history }: CreateNavigatorOptions): NavigatorResult => {
    let isRedirecting = false;

    const syncToRoute = async (path: string, _state: NavigatorState = {}) => {
        const { search: searchQuery = {} } = _state;
        const [normalized, , raw] = normalizeRoute(path, searchQuery);

        const handleRedirect = async (redirectPath: string, redirectSearch?: Record<string, string>) => {
            isRedirecting = true;
            await syncToRoute(redirectPath, { search: redirectSearch });
            isRedirecting = false;
        };

        const { route: matchedRoute, params: matchedParams } = match(normalized);
        const query = Object.fromEntries([...raw.searchParams.entries()]);

        const guardContext: GuardContext = {
            from: state().route
                ? {
                      path: state().path,
                      params: state().params,
                      query: state().query,
                  }
                : null,
            to: {
                path: normalized,
                params: matchedParams,
                query,
            },
            navigate: async (path: string, init?: { search?: Record<string, string> }) => {
                await handleRedirect(path, init?.search);
            },
        };

        if (!isRedirecting) {
            const canDeactivate = await canDeactivateRoute(state().route, guardContext);
            if (!canDeactivate) return;
        }

        if (matchedRoute.redirect) {
            await handleRedirect(matchedRoute.redirect);
            return;
        }

        const canActivate = await canActivateRoute(matchedRoute, guardContext);
        if (!canActivate) return;

        const fragment = await resolveComponent(matchedRoute.component);

        state().updateState({
            path: normalized,
            route: matchedRoute,
            params: matchedParams,
            query,
            fragment,
        });
    };

    const navigate: Navigator = async (path: string, _state: NavigatorState = {}) => {
        const { state: props = {}, search: searchQuery = {} } = _state;

        await syncToRoute(path, _state);

        const currentState = state();
        history.push(currentState.path, {
            params: currentState.params,
            search: currentState.query,
            serialized: currentState.path,
            route: path,
            ...props,
        });
    };

    return { navigate, syncToRoute };
};
