import type { AuroraRuntimeNavigationItem } from '../../lib/config/config';
import { selectNavigation } from '../../lib/navigation/select-navigation';
import { deploymentUrl } from '../../lib/url/deployment-url';
import type { ParsedAuroraConfig, ParsedNavigationItem } from './parse-config';

export const createSsgRuntime = (config: Pick<ParsedAuroraConfig, 'navigation' | 'search' | 'site'>, base: string) => {
    const routeHref = (targetPath: string, currentPath: string) => {
        if (base === './' || base === '') {
            const depth = currentPath === '/' ? 0 : currentPath.slice(1).split('/').length;
            const prefix = '../'.repeat(depth);
            const target = targetPath === '/' ? '' : targetPath.slice(1);
            return prefix + target || './';
        }

        const prefix = base.endsWith('/') ? base : `${base}/`;
        return targetPath === '/' ? prefix : `${prefix}${targetPath.slice(1)}`;
    };

    const resolveNavigation = (
        items: ParsedNavigationItem[],
        currentPath: string,
        linkPath: string,
    ): AuroraRuntimeNavigationItem[] =>
        items.map((item) => ({
            label: item.label,
            ...(item.path ? { path: routeHref(item.path, linkPath) } : {}),
            active: item.path === currentPath,
            children: resolveNavigation(item.children, currentPath, linkPath),
        }));

    const resolveSiteConfig = (path: string, linkPath = path) => ({
        ...config.site,
        base: routeHref('/', linkPath),
        routes: resolveNavigation(selectNavigation(config.navigation, path), path, linkPath),
        search: config.search,
    });

    return {
        deploymentRoot: config.site.url ? deploymentUrl(config.site.url, base).href : '',
        resolveSiteConfig,
        routeHref,
    };
};
