import type { FragmentMap } from '../component/template-parser';
import type { Fragment } from '../internals/fragment';
import { identifier } from '../internals/identifier';
import type { Struct } from './struct';

export const createStructFragment = (struct: Struct, fragments: FragmentMap): Fragment => {
    const id = identifier();
    return {
        id,
        fragments,
        resolve: () => `<!--:${id}:-->`,
        hydrateClient: (node: Node) => {
            if (node instanceof Comment) {
                return struct(node);
            }

            throw new TypeError('Structs cannot be applied to non comment nodes.');
        },
    };
};
