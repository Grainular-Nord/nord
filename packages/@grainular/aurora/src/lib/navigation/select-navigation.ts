type RootedNavigationItem = {
    label: string;
    root?: string;
};

const containsRoute = (root: string, route: string) =>
    root === '/' ? route.startsWith('/') : route === root || route.startsWith(`${root}/`);

export const selectNavigation = <Item extends RootedNavigationItem>(items: Item[], route: string): Item[] => {
    const selectedRoot = items
        .flatMap(({ root }) => (root && containsRoute(root, route) ? [root] : []))
        .sort((left, right) => right.length - left.length)[0];

    return selectedRoot ? items.filter(({ root }) => root === selectedRoot) : items;
};
