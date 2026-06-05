import { navigate } from './navigate';

export const redirector = () => {
    const redirects = new Set<() => void>();

    return {
        hasRedirects: () => redirects.size > 0,
        add: (path: string) => {
            redirects.add(() => {
                queueMicrotask(() => {
                    navigate({ path, history: 'auto' });
                });
            });
        },
        execute: (event?: NavigateEvent) => {
            event?.preventDefault();
            Array.from(redirects.values()).at(0)?.();
            redirects.clear();
        },
    };
};
