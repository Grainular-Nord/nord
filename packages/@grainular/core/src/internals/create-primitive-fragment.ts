import { updateAttributeValue } from './attribute-bindings';
import type { Fragment } from './fragment';
import { identifier } from './identifier';

// Creates a primitive fragment, containing a scalar value
// that get's resolved and rendered only once.
export const createPrimitiveFragment = (fragmentValue: boolean | string | number, id = identifier()): Fragment => {
    return {
        id,
        resolve: () => `<!--:${id}:-->`,
        render: () => String(fragmentValue),
        hydrate: (node: Node) => {
            // Hydrate the node depending of it's type
            if (node instanceof Comment) {
                return node.replaceWith(new Text(String(fragmentValue ?? '')));
            }

            // Do the same for attributes
            if (node instanceof Element) {
                updateAttributeValue(id, fragmentValue ?? '');
            }
        },
    };
};
