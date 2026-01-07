import type { Route } from './route';

// Create a map of routes to match against
// When a route is matched, the router state
// is constructed from it
export const routeMap = (routes: Route[]) => {
    const segments = {
        '': {
            onActivate: () => {
                /** Route config */
            },
            children: {
                app: {
                    onActivate: () => {},
                },
                home: {},
            },
        },
    };

    return {
        match: (path: string) => {},
    };
};
