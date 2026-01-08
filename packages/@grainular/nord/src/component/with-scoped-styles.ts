import type { StyleFragment } from '../application/style-parser';
import { type ComponentFragment, IS_COMPONENT } from './component-fragment';
import type { PureComponent } from './component-types';

export const withScopedStyles = <T extends PureComponent>(component: T, styles: StyleFragment) => {
    return (...args: Parameters<T>): ComponentFragment => {
        // @ts-expect-error: We can safely pass arguments even to a component that
        // doesn't want them. If no arguments are passed, undefined will be correct
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
