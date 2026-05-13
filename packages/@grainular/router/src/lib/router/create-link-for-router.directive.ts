import type { Grain } from '@grainular/grains';
import { type Fragment, createDirective } from '@grainular/nord';
import type { LinkOptions } from '../../types/link-options';
import type { Navigator } from '../../types/navigator';
import type { Route } from '../../types/route';

const createHandler = (node: Element, navigate: Navigator, options: LinkOptions) => {
    const { params } = options;
    return (event: Event) => {
        event.preventDefault();
        const target = node.getAttribute('href');
        if (target) navigate(target, { search: params?.() ?? {} });
    };
};

const createActiveMatcher = (node: Element, options: Omit<Required<LinkOptions>, 'params'>) => {
    return (target: string) => {
        const { activeClass, matchMode } = options;
        const href = node.getAttribute('href');
        if (!href) return;

        const isActive = matchMode === 'exact' ? target === href : target.startsWith(href);
        isActive ? node.classList.add(activeClass) : node.classList.remove(activeClass);
    };
};

export const createLinkForRouter = (navigate: Navigator, matched: Grain<[string, Route | null]>) => {
    return (options: LinkOptions = {}): Fragment =>
        createDirective((node) => {
            const handler = createHandler(node, navigate, options);
            node.addEventListener('click', handler);

            // Handling the active class
            const { activeClass = '', matchMode = 'prefix' } = options;
            const matcher = createActiveMatcher(node, { activeClass, matchMode });

            const unsubscribe = matched.subscribe(([path]) => {
                matcher(path);
            });

            return () => {
                node.removeEventListener('click', handler);
                unsubscribe?.();
            };
        });
};
