import { lifecycleObserver } from '../application/lifecycle-observer';
import { FRAGMENT_ID, type Fragment } from '../internals/fragment';
import { createIdentifier } from '../internals/identifier';

export const createStruct = (
    struct: (node: Comment) => void | (() => void),
    snapshot: () => string = () => '',
): Fragment => {
    const fragmentId = createIdentifier();
    return {
        [FRAGMENT_ID]: fragmentId,
        resolve: () => `<!--${fragmentId.get()}-->`,
        render: () => snapshot(),
        hydrate: (node: Node) => {
            if (node instanceof Comment) {
                const onDestroy = struct(node);
                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
