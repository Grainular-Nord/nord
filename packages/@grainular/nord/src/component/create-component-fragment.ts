import { type Fragment } from '../internals/fragment';
import { createIdentifier } from '../internals/identifier';
import { type ComponentFragment, IS_COMPONENT } from './component-fragment';
import { hydrateComponentTemplate } from './hydrate-component-template';

const templateCache = new Map<string, HTMLTemplateElement>();
const getTemplate = (html: string) => {
    const template = templateCache.get(html);
    if (template && template.ownerDocument === document) {
        return template;
    }

    const created = document.createElement('template');
    created.innerHTML = html.trim();
    templateCache.set(html, created);
    return created;
};

export const createComponentFragment = (template: string[], fragments: Fragment[]): ComponentFragment => {
    const html = template.join('');
    const fragmentId = createIdentifier();

    return {
        fragmentId: fragmentId,
        [IS_COMPONENT]: true as const,
        resolve: () => `<!--${fragmentId.get()}-->`,
        render: () => {
            return template
                .filter((_, i) => i % 2 === 0) // Keep even indices (Strings only)
                .flatMap((str, idx) => [str, fragments[idx]?.render() ?? ''])
                .join('');
        },
        hydrate: (node: Node, def) => {
            // Bail early if we have a hydration mismatch here
            if (!(node instanceof Comment)) return;

            // Retrieve the template, by either creating or
            // cloning it
            const template = getTemplate(html).content.cloneNode(true);

            // Hydrate the component template using the fragment,
            // the available fragments and scope the nodes if required
            for (const { fragment, args } of hydrateComponentTemplate(template, fragments, def?.scope)) {
                fragment.hydrate(...args);
            }

            node.replaceWith(template);
        },
    };
};
