import { type Fragment, html } from '@grainular/nord';
import { silo } from '@grainular/silo';
import type { LinkOptions } from '../../types/link-options';
import type { Navigator } from '../../types/navigator';
import type { Route } from '../../types/route';
import type { RouterState } from '../../types/router-state';
import { createHistoryManager } from '../history/history-manager';
import { type ActivatedRoute, createActivatedRoute } from './create-activated-route';
import { createLinkForRouter } from './create-link-for-router.directive';
import { createNavigator } from './create-navigator';
import { createOutletStruct } from './create-outlet-struct';
import { createRouteMatcher } from './create-route-matcher';

const emptyFragment = html``;

export type Router = {
    navigate: Navigator;
    $outlet: Fragment;
    activatedRoute: ActivatedRoute;
    link: (options?: LinkOptions) => Fragment;
};

export const router = (routes: Route[]): Router => {
    const { match } = createRouteMatcher(routes);
    const history = createHistoryManager();

    const state = silo<RouterState>((set) => ({
        path: 'INIT',
        route: null,
        params: {},
        query: {},
        fragment: emptyFragment,
        updateState: (newState: Omit<RouterState, 'updateState'>) => set(newState),
    }));

    const activatedRoute = createActivatedRoute(state);
    const matched = state.select((routerState) => [routerState.path, routerState.route] as [string, Route | null]);

    const { navigate, syncToRoute } = createNavigator({ match, state, history });

    const cleanupHistory = history.onPopState((route) => {
        syncToRoute(route);
    });

    syncToRoute(window.location.pathname);

    return {
        navigate,
        activatedRoute,
        link: createLinkForRouter(navigate, matched),
        $outlet: createOutletStruct(state),
    };
};
