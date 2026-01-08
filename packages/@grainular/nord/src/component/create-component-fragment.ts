import type { Fragment } from '../internals/fragment';
import { identifier } from '../internals/identifier';
import { type ComponentFragment, IS_COMPONENT } from './component-fragment';
import { hydrateComponentTemplate } from './hydrate-component-template';

export const createComponentFragment = (
    template: Fragment[],
    fragments: Map<string, Fragment>,
    id = identifier(),
): ComponentFragment => {
    return {
        id: id,
        [IS_COMPONENT]: true as const,
        resolve: () => `<!--:${id}:-->`,
        render: () => template.map(({ render }) => render()).join(''),
        hydrate: (node: Node, scope?: string) => {
            // Bail early if we have a hydration mismatch here
            if (!(node instanceof Comment)) return;

            // Create and hydrate the fragment, before
            // replacing the hydration marker.
            const html = template.map(({ resolve }) => resolve()).join('');
            const fragment = document.createElement('template');
            fragment.innerHTML = html.trim();

            // Hydrate the component template using the fragment,
            // the available fragments and scope the nodes if required
            for (const hydrator of hydrateComponentTemplate(fragment.content, fragments, scope)) hydrator();

            node.replaceWith(fragment.content);
        },
    };
};
