import type { ComponentFragment } from '../component/component-fragment';

/**
 * Method to hydrate a fragment and retrieve it's
 * nodes.
 *
 * @param fragment
 */
export const hydrateFragment = (fragment: ComponentFragment) => {
    const container = document.createDocumentFragment();
    const anchor = new Comment();

    container.append(anchor);
    fragment.hydrate(anchor);

    return Array.from(container.childNodes);
};
