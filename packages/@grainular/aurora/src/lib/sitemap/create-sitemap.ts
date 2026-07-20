import { deploymentUrl } from '../url/deployment-url';

const escapeXml = (value: string) =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

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
