import { lifecycleObserver } from '../application/lifecycle-observer';
import { identifier } from '../internals/identifier';
import { SYMBOLS } from '../internals/symbols';
import type { StructFragment } from './struct-fragment';

export const createStruct = (
    struct: (node: Comment) => void | (() => void),
    snapshot: () => string = () => '',
    id = identifier(),
): StructFragment => {
    return {
        id,
        [SYMBOLS.isStruct]: SYMBOLS.isStruct,
        resolve: () => `<!--:${id}:-->`,
        render: () => snapshot(),
        hydrate: (node: Node) => {
            if (node instanceof Comment) {
                const onDestroy = struct(node);
                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
