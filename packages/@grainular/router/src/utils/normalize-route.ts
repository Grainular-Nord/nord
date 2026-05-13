import type { Params } from '../types/params';

export const normalizeRoute = (path: string, query: Params = {}): [string, string, URL] => {
    const absolute = path.startsWith('.');
    const resource = new URL(path, absolute ? '' : window.location.href);

    for (const [key, value] of Object.entries(query)) {
        resource.searchParams.append(key, value);
    }

    return [resource.pathname, resource.search, resource];
};
