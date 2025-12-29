import { lifecycleObserver } from '../application/lifecycle-observer';
import { identifier } from '../internals/identifier';
import { SYMBOLS } from '../internals/symbols';
import type { StructFragment } from './struct-fragment';

export const createStruct = (struct: (node: Comment) => void | (() => void), id = identifier()): StructFragment => {
    return {
        id,
        [SYMBOLS.isStruct]: SYMBOLS.isStruct,
        resolve: () => `<!--:${id}:-->`,
        render: () => '', // todo -> evaluate current path if possible and render html
        hydrate: (node: Node) => {
            if (node instanceof Comment) {
                const onDestroy = struct(node);
                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
