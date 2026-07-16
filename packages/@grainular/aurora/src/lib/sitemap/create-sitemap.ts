const escapeXml = (value: string) =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const deploymentUrl = (site: string, base: string) => {
    const root = site.endsWith('/') ? site : `${site}/`;
    const path = base === './' || base === '' ? '' : base.replace(/^\//, '');
    return new URL(path.endsWith('/') ? path : `${path}/`, root);
};

export const createSitemap = (site: string, base: string, paths: string[]) => {
    const root = deploymentUrl(site, base);
    const urls = paths
        .map((path) => new URL(path === '/' ? '' : path.slice(1), root))
        .map((url) => `    <url>\n        <loc>${escapeXml(url.href)}</loc>\n    </url>`)
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};
