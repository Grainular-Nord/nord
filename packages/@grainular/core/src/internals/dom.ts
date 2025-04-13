import { hydrateClient } from '../application/hydrate-client';
import { type ComponentFragment, isComponent } from '../component/component-fragment';
import { fragmentMap } from '../component/template-parser';

export const DOM = {
    removeNodes: (nodes: Element[] = []) => {
        for (const node of nodes) node.remove();
    },
    insertFragment: (anchor: Comment, fragment?: DocumentFragment | null): Element[] => {
        if (!fragment) return [];

        const cloned = fragment.cloneNode(true);
        const nodes = Array.from(cloned.childNodes);
        anchor.before(...nodes);
        return nodes as Element[];
    },
    hydrateTemplate: (fragment: DocumentFragment) => {
        const cloned = fragment.cloneNode(true) as DocumentFragment;
        hydrateClient(cloned, fragmentMap);
        return cloned;
    },
    getHydratedFragment: (fragment: ComponentFragment | string | null) => {
        const content = isComponent(fragment) ? fragment.resolve() : fragment;
        if (!content) return null;
        const template = document.createElement('template');
        template.innerHTML = content;
        return DOM.hydrateTemplate(template.content);
    },
};
