import type { StyleFragment } from '../application/style-parser';
import { type ComponentFragment, IS_COMPONENT } from './component-fragment';
import type { ComponentProps } from './component-types';

export const withScopedStyles = <P extends ComponentProps | undefined = undefined>(
    component: (args: P) => ComponentFragment,
    styles: StyleFragment,
) => {
    return (args: P = undefined as P): ComponentFragment => {
        // We pass the argument here even if it's undefined,
        // which is fine for a component without props
        const fragment = component(args);

        return {
            id: fragment.id,
            assignIdentifier: fragment.assignIdentifier,
            [IS_COMPONENT]: true as const,
            render: fragment.render,
            resolve: fragment.resolve,
            hydrate: (node: Node) => {
                // Hydrate the fragment with a scope marker
                fragment.hydrate(node, { scope: styles.id });
                styles.hydrate();
            },
        };
    };
};
