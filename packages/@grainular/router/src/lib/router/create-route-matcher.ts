import type { Params } from '../../types/params';
import type { Route } from '../../types/route';
import { normalizeRoute } from '../../utils/normalize-route';

type TreeNode = {
    [key: string]: TreeNode;
} & {
    route?: Route;
};

type Tree = Record<string, TreeNode>;

type MatchResult = {
    route: Route;
    params: Params;
};

export type RouteMatcher = {
    match: (route: string) => MatchResult;
};

export const createRouteMatcher = (routes: Route[]) => {
    const tree: Tree = {};
    let fallbackRoute: Route | null = null;

    const returnFallback = (): MatchResult => {
        if (fallbackRoute) {
            return { route: fallbackRoute, params: {} };
        }
        throw new Error('MISMATCH');
    };

    const addRoute = (route: Route, parentNode = tree) => {
        if (route.path === '**') {
            fallbackRoute = route;
            return;
        }

        const [normalized] = normalizeRoute(route.path);
        const segments = normalized.split('/').filter((v) => v !== '');

        const currentNode: TreeNode = segments.reduce((acc, cur) => {
            if (!acc[cur]) {
                acc[cur] = {};
            }
            return acc[cur];
        }, parentNode);

        if (route) {
            currentNode.route = route;
        }

        if (route.children) {
            for (const childRoute of route.children) {
                addRoute(childRoute, currentNode);
            }
        }
    };

    for (const route of routes) {
        addRoute(route);
    }

    const match = (route: string): MatchResult => {
        const segments = route.split('/').filter((v) => v !== '');
        let currentNode: TreeNode | undefined = tree;
        const params: Params = {};

        for (const segment of segments) {
            if (!currentNode) {
                return returnFallback();
            }

            if (segment in currentNode) {
                currentNode = currentNode[segment] as TreeNode;
                continue;
            }

            const paramMatch: string | undefined = Object.keys(currentNode).find((key) => key.startsWith(':'));

            if (paramMatch) {
                const paramName = paramMatch.slice(1);
                params[paramName] = segment;
                currentNode = currentNode[paramMatch];
                continue;
            }

            return returnFallback();
        }

        if (currentNode?.route) {
            return { route: currentNode.route, params };
        }

        return returnFallback();
    };

    return { match } as const;
};
