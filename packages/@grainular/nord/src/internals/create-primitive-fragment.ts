import type { Fragment } from './fragment';
import { createIdentifier } from './identifier';

// Creates a primitive fragment, containing a scalar value
// that get's resolved and rendered only once.
export const createPrimitiveFragment = (fragmentValue: boolean | string | number): Fragment => {
    let id = '';
    return {
        id: () => id,
        assignIdentifier: (idx: number) => {
            id = createIdentifier(idx);
        },
        resolve: () => `<!--:${id}:-->`,
        render: () => String(fragmentValue),
        hydrate: (node: Node, { binding } = {}) => {
            // Hydrate the node depending of it's type
            if (node instanceof Comment) {
                return node.replaceWith(new Text(String(fragmentValue)));
            }

            // Do the same for attributes
            if (node instanceof Element) {
                binding?.(fragmentValue);
            }
        },
    };
};
