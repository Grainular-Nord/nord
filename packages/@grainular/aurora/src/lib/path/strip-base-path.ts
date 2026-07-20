export const stripBasePath = (pathname: string, base: string) => {
    if (base === '/' || base === './' || base === '') return pathname;

    const basePath = base.startsWith('http://') || base.startsWith('https://') ? new URL(base).pathname : base;
    const prefix = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length) || '/';
    return pathname;
};
