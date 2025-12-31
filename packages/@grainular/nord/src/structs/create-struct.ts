import { lifecycleObserver } from '../application/lifecycle-observer';
import type { Fragment } from '../internals/fragment';
import { identifier } from '../internals/identifier';

export const createStruct = (
    struct: (node: Comment) => void | (() => void),
    snapshot: () => string = () => '',
    id = identifier(),
): Fragment => {
    return {
        id,

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
