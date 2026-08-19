import type {
    AuroraConfig,
    AuroraNavigationItem,
    AuroraPageConfig,
    AuroraRuntimeNavigationItem,
} from '../../lib/config/config';
import { normalizeRoutePath } from '../../lib/path/normalize-route-path';

export type ParsedNavigationItem = Omit<AuroraRuntimeNavigationItem, 'active' | 'children'> & {
    root?: string;
    children: ParsedNavigationItem[];
};

export type ParsedAuroraConfig = {
    navigation: ParsedNavigationItem[];
    page: AuroraPageConfig;
    search: boolean;
    site: NonNullable<AuroraConfig['site']>;
};

const parseNavigation = (items: AuroraNavigationItem[] = []): ParsedNavigationItem[] =>
    items.map((item) => ({
        label: item.label,
        ...(item.root ? { root: normalizeRoutePath(item.root) } : {}),
        ...('path' in item && item.path ? { path: normalizeRoutePath(item.path) } : {}),
        children: parseNavigation(item.children ?? []),
    }));

export const parseConfig = (config: AuroraConfig): ParsedAuroraConfig => ({
    navigation: parseNavigation(config.navigation),
    page: config.page ?? {},
    search: config.search ?? false,
    site: config.site ?? {},
});
