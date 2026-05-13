import type { Navigator } from '../types/navigator';
import type { RouteGuard } from '../types/route-guard';

export const checkGuard = (path: string, redirect: Navigator) => {
    return (guard: RouteGuard) => {
        const result = guard(path, redirect);
        return !(result instanceof Promise) ? result : false;
    };
};
