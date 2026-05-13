import type { Params } from '../../types/params';

export type HistoryState = {
    params: Params;
    search: Params;
    serialized: string;
    route: string;
    [key: string]: unknown;
};

export const createHistoryManager = () => {
    const push = (path: string, state: HistoryState) => {
        window.history.pushState(state, path, path);
    };

    const onPopState = (handler: (route: string) => void) => {
        const listener = (ev: PopStateEvent) => {
            if (ev.state?.route) {
                handler(ev.state.route);
            }
        };

        window.addEventListener('popstate', listener);

        return () => window.removeEventListener('popstate', listener);
    };

    return { push, onPopState };
};

export type HistoryManager = ReturnType<typeof createHistoryManager>;
