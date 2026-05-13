import type { Route } from '../../types/route';
import type { GuardContext, GuardResult, RouteGuard } from '../../types/route-guard';

export const executeGuards = async (guards: RouteGuard[], ctx: GuardContext): Promise<boolean> => {
    for (const guard of guards) {
        let navigateCalled = false;

        const wrappedContext: GuardContext = {
            ...ctx,
            navigate: async (path: string, init?: { search?: Record<string, string> }) => {
                navigateCalled = true;
                return ctx.navigate(path, init);
            },
        };

        const result = guard.use(wrappedContext);
        const resolved: GuardResult = result instanceof Promise ? await result : result;

        if (navigateCalled || resolved === false) {
            return false;
        }
    }

    return true;
};

export const canDeactivateRoute = (route: Route | null, ctx: GuardContext): Promise<boolean> => {
    if (!route?.guards) return Promise.resolve(true);
    const postGuards = route.guards.filter((g) => g.run === 'post');
    if (postGuards.length === 0) return Promise.resolve(true);
    return executeGuards(postGuards, ctx);
};

export const canActivateRoute = (route: Route, ctx: GuardContext): Promise<boolean> => {
    if (!route.guards) return Promise.resolve(true);
    const preGuards = route.guards.filter((g) => g.run === 'pre');
    if (preGuards.length === 0) return Promise.resolve(true);
    return executeGuards(preGuards, ctx);
};
