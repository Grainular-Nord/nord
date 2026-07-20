import { stripBasePath } from '../path/strip-base-path';

type HtmlPage = { path: string; source: string };

export type DeadLink = { page: string; href: string };

const origin = 'https://aurora.invalid';
const attributes = (source: string, tag: string, attribute: string) => {
    const values: (string | undefined)[] = [];
    const pattern = new RegExp(`<${tag}\\b[^>]*\\b${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'gi');

    for (const match of source.matchAll(pattern)) values.push(match[1] ?? match[2] ?? match[3]);
    return values.filter((value): value is string => !!value);
};

const routePath = (pathname: string, base: string) => {
    const path = stripBasePath(decodeURI(pathname), base).replace(/\/(?:index\.html)?$/, '');
    return path || '/';
};

const isFile = (path: string) => /\/[^/]+\.[^/]+$/.test(path);

export const findDeadLinks = (pages: HtmlPage[], base: string): DeadLink[] => {
    const routes = new Map(pages.map((page) => [page.path, new Set(attributes(page.source, '[a-z][\\w-]*', 'id'))]));
    const dead = new Map<string, DeadLink>();

    for (const page of pages) {
        const current = new URL(page.path === '/' ? '/' : `${page.path}/`, origin);

        for (const href of attributes(page.source, 'a', 'href')) {
            const target = new URL(href, current);
            if (target.origin !== origin) continue;

            const path = routePath(target.pathname, base);
            if (isFile(path)) continue;

            const ids = routes.get(path);
            const anchor = decodeURIComponent(target.hash.slice(1));
            if (!ids || (anchor && !ids.has(anchor))) dead.set(`${page.path}\0${href}`, { page: page.path, href });
        }
    }

    return [...dead.values()];
};
