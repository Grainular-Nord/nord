export type NavigationHookContext = {
    path: string | null;
    resolved: string | null;
    params: Record<string, string>;
    query: Record<string, string>;
    navigate: (path: string) => void;
};
export type NavigationHook = {
    run: 'pre' | 'post';
    handler: (ctx: NavigationHookContext) => Promise<boolean | void>;
};

export const pre = (handler: (ctx: NavigationHookContext) => Promise<boolean | void>): NavigationHook => {
    return { run: 'pre' as const, handler };
};

export const post = (handler: (ctx: NavigationHookContext) => Promise<boolean | void>): NavigationHook => {
    return { run: 'post' as const, handler };
};
