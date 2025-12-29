import { lifecycleObserver } from '../application/lifecycle-observer';
import type { Fragment } from '../internals/fragment';
import { identifier } from '../internals/identifier';

export const createDirective = (handler: (node: Element) => void | (() => void), id = identifier()): Fragment => {
    return {
        id,
        resolve: () => `${id}`,
        render: () => '',
        hydrate: (node: Node) => {
            if (node instanceof Element) {
                const onDestroy = handler(node);
                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
