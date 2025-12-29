import type { Fragment } from '../internals/fragment';
import { identifier } from '../internals/identifier';
import { SYMBOLS } from '../internals/symbols';
import type { ComponentFragment } from './component-fragment';
import { hydrateComponentTemplate } from './hydrate-component-template';

export const createComponentFragment = (
    template: Fragment[],
    fragments: Map<string, Fragment>,
    id = identifier(),
): ComponentFragment => {
    return {
        id: id,
        [SYMBOLS.isComponent]: SYMBOLS.isComponent,
        resolve: () => `<!--:${id}:-->`,
        render: () => template.map(({ render }) => render()).join(''),
        hydrate: (node: Node) => {
            // Bail early if we have a hydration mismatch here
            if (!(node instanceof Comment)) return;

            // Create and hydrate the fragment, before
            // replacing the hydration marker.
            const html = template.map(({ resolve }) => resolve()).join('');
            const fragment = document.createElement('template');
            fragment.innerHTML = html.trim();

            for (const hydrator of hydrateComponentTemplate(fragment.content, fragments)) hydrator();

            node.replaceWith(fragment.content);
        },
    };
};
