import type { NavigationHook, NavigationHookContext } from './hooks';

export const resolveHooks = (hooks: NavigationHook[], context: NavigationHookContext) => {
    for (const { handler } of hooks) {
        const result = handler({
            ...context,
        });

        // Bail if a hook returns false explicitly
        if (result === false) return false;
    }

    return true;
};
