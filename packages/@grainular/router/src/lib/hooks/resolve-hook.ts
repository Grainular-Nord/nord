import type { NavigationHook, NavigationHookContext } from './hooks';

export const resolveHooks = async (hooks: NavigationHook[], context: Omit<NavigationHookContext, 'navigate'>) => {
    for (const { handler } of hooks) {
        const result = await handler({
            ...context,
            navigate: (path: string) => {
                return navigation.navigate(path);
            },
        });

        // Bail if a hook returns false explicitly
        if (result === false) return false;
    }

    return true;
};
