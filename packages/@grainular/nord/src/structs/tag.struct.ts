import { templateParser } from '../application/template-parser';
import type { PropsWithChildren } from '../component/component-types';
import type { Fragment } from '../internals/fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createStruct } from './create-struct';

type TagOpts<T> = { as: T; children?: PropsWithChildren['children']; use?: Fragment[] };
export const $tag = <T extends keyof HTMLElementTagNameMap>(
    { as, children, use = [] }: TagOpts<T>,
    onMount?: (node: HTMLElementTagNameMap[T]) => (() => void) | void,
) => {
    return createStruct((node) => {
        const element = document.createElement(as);
        element.append(...hydrateFragment(templateParser`${children}`));

        // Hydrate the fragment from the passed elements
        // This will directly register any eventual cleanup
        // that triggers once the node is removed from the DOM
        for (const fragment of use) {
            fragment.hydrate(element);
        }

        node.replaceWith(element);
        return onMount?.(element);
    });
};
