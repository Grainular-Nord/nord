import type { StyleFragment } from '../application/css-parser';
import { type ComponentFragment, IS_COMPONENT } from './component-fragment';
import type { ComponentProps, PureComponent } from './component-types';

export const withScopedStyles = <T extends ComponentProps>(component: PureComponent<T>, styles: StyleFragment) => {
    return (args: T): ComponentFragment => {
        const fragment = component(args);

        // Attach the styles
        const { attach, id: styleId } = styles;

        return {
            id: fragment.id,
            [IS_COMPONENT]: true as const,
            render: fragment.render,
            resolve: fragment.resolve,
            hydrate: (node: Node) => {
                // Hydrate the fragment with a scope marker
                fragment.hydrate(node, styleId);
                attach();
            },
        };
    };
};
