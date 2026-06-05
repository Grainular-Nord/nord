export type NavigationHookContext = {
    path: string | null;
    resolved: string | null;
    params: Record<string, string>;
    query: Record<string, string>;
    redirect: (path: string) => void;
};
export type NavigationHook =
    | {
          run: 'pre' | 'post';
          handler: (ctx: NavigationHookContext) => boolean | void;
      }
    | {
          run: 'load';
          handler: (ctx: Omit<NavigationHookContext, 'redirect'>) => Promise<boolean | void>;
      };

export const pre = (handler: (ctx: NavigationHookContext) => boolean | void): NavigationHook => {
    return { run: 'pre' as const, handler };
};

export const post = (handler: (ctx: NavigationHookContext) => boolean | void): NavigationHook => {
    return { run: 'post' as const, handler };
};

export const load = (
    handler: (ctx: Omit<NavigationHookContext, 'redirect'>) => Promise<boolean | void>,
): NavigationHook => {
    return { run: 'load' as const, handler };
};
