import { lifecycleObserver } from '../application/lifecycle-observer';
import type { Fragment } from '../internals/fragment';
import { createIdentifier } from '../internals/identifier';

export const createStruct = (
    struct: (node: Comment) => void | (() => void),
    snapshot: () => string = () => '',
): Fragment => {
    let _id = '';
    return {
        get id() {
            return _id;
        },
        set id(idx: string) {
            _id = createIdentifier(idx);
        },
        resolve: () => `<!--${_id}-->`,
        render: () => snapshot(),
        hydrate: (node: Node) => {
            if (node instanceof Comment) {
                const onDestroy = struct(node);
                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
