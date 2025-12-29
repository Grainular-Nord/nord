import type { ComponentFragment } from '../component/component-fragment';

/**
 * Method to hydrate a fragment and retrieve it's
 * nodes.
 *
 * @param fragment
 */
export const hydrateFragment = (fragment: ComponentFragment) => {
    const template = document.createElement('template');
    const anchor = new Comment();

    template.content.append(anchor);
    fragment.hydrate(anchor);

    return Array.from(template.content.childNodes) as Element[];
};
