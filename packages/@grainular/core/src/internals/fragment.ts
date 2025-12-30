/**
 * A Fragment is a single, atomic unit of work to be rendered,
 * representing anything from scalar value to component trees
 *
 * A fragment will be able to resolve to a fragment string, which
 * contains hydration markers, as well as be able to render itself
 * for SSR, and hydrate itself from a specific node.
 */
export type Fragment = {
    /**
     * A component fragment id to identify the fragment by
     */
    id: string;

    /**
     * Method that returns a hydration marker to insert
     * for hydration
     */
    resolve: () => string;

    /**
     * Creates a hydrated snapshot of the current state,
     * allowing to render the fragment in SSR mode
     */
    render: () => string;

    /**
     * Hydrates the fragment onto the given target node
     *
     * @param target
     */
    hydrate: (target: Node, scope?: string) => void;
};
