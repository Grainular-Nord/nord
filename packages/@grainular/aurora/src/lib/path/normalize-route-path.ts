export const normalizeRoutePath = (path: string) => {
    const normalized = `/${path}`.replace(/\/{2,}/g, '/');
    return normalized.length > 1 ? normalized.replace(/\/$/, '') : normalized;
};
