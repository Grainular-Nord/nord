import type { Fragment } from '../internals/fragment';
import { identifier } from '../internals/identifier';
import type { Struct } from './struct';

export const createStructFragment = (struct: Struct): Fragment => {
    const id = identifier();
    return {
        id,
        resolve: () => `<!--:${id}:-->`,
        hydrateClient: (node: Node) => {
            if (node instanceof Comment) {
                return struct(node);
            }

            throw new TypeError('Structs cannot be applied to non comment nodes.');
        },
    };
};
