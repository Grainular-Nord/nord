import type { Params } from './params';

export type GuardContext = {
    from: { path: string; params: Params; query: Params } | null;
    to: { path: string; params: Params; query: Params };
    navigate: (path: string, init?: { search?: Record<string, string> }) => Promise<void>;
};

export type GuardResult = boolean | void | Promise<boolean | void>;

export type RouteGuard = {
    run: 'pre' | 'post';
    use: (ctx: GuardContext) => GuardResult;
};
