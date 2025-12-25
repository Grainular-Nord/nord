import type { FragmentMap } from '../component/template-parser';
import type { Fragment } from '../internals/fragment';
import { identifier } from '../internals/identifier';
import type { Directive } from './directive';

export const createDirectiveFragment = (directive: Directive, fragments: FragmentMap): Fragment => {
    const id = identifier();
    return {
        id,
        fragments,
        resolve: () => id,
        hydrateClient: (node: Node) => {
            if (node instanceof HTMLElement) {
                return directive(node);
            }

            throw new TypeError('Directives cannot be applied to non element nodes.');
        },
    };
};
