export const deploymentUrl = (site: string, base: string) => {
    const root = site.endsWith('/') ? site : `${site}/`;
    const path = base === './' || base === '' ? '' : base.replace(/^\//, '');
    return new URL(path.endsWith('/') ? path : `${path}/`, root);
};
