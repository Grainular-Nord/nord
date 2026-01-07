import { type Grain, grain } from '@grainular/grains';
import {
    type ComponentFragment,
    createDirective,
    createStruct,
    disconnectNodes,
    hydrateFragment,
} from '@grainular/nord';
import type { Route } from './lib/route';

type RouterState = {
    route: string;
    component: () => ComponentFragment;
    origin: string;
};

type ParamMap = Map<string, string>;

export type RouterStateSnapshot<T = unknown> = {
    route: string;
    origin: string;
    paramMap: ParamMap;
    queryParamMap: ParamMap;
    context: T;
};

type Router = {
    navigate: NavigatorFn;
    matched: Grain<RouterState>;
};

type RoutingEvent = CustomEvent<{ route: string; context: unknown }>;
export const isRoutingEvent = (event: Event): event is RoutingEvent => {
    return event && event.type === 'nord.router.routing';
};

export type NavigatorFn = () => void;

export const createRouter = (routes: Route[]): { router: Router; navigate: NavigatorFn } => {
    const navigate = () => {};
    window.addEventListener('nord.router.routing', (ev) => {
        if (!isRoutingEvent(ev)) return;
        // matched.set(getRouteMatch(ev.detail.route));
    });

    // const initialState = getRouteMatch(window.location.pathname);
    const matched = grain<RouterState>({} as RouterState);
    // matched.set(initialState);

    const router = { navigate, matched };
    return { router, navigate };
};
export const $RouterOutlet = ({ router }: { router: Router }) => {
    return createStruct((node) => {
        const nodeSet = new Set<Element>();
        const setRoutedComponent = (component: ComponentFragment) => {
            disconnectNodes([...nodeSet.values()]);
            const nodes = hydrateFragment(component);
            for (const node of nodes) nodeSet.add(node);
            node.replaceWith(...nodes);
        };

        const { matched } = router;
        matched.subscribe((matchedRoute) => {
            console.log({ matchedRoute });
            const component = matchedRoute.component;
            setRoutedComponent(component());
        });
    });
};

const dispatchRoutingEvent = ({ node, context }: { node: Element; context: unknown }) => {
    node.dispatchEvent(
        new CustomEvent('nord.router.routing', {
            bubbles: true,
            detail: {
                route: node.getAttribute('href'),
                context,
            },
        }),
    );
};

type RouterLinkInit<T> = { context?: () => T; activeClass?: string };
export const routerLink = <T>(init: RouterLinkInit<T> = {}) => {
    return createDirective((node) => {
        node.addEventListener('click', (ev: Event) => {
            ev.preventDefault();
            dispatchRoutingEvent({ node, context: init.context?.() ?? {} });
        });
    });
};

export type { Route };
