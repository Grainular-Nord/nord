import { lifecycleObserver } from '../application/lifecycle-observer';
import { identifier } from '../internals/identifier';
import { SYMBOLS } from '../internals/symbols';
import type { DirectiveFragment } from './directive-fragment';

export const createDirective = (
    handler: (node: Element) => void | (() => void),
    id = identifier(),
): DirectiveFragment => {
    return {
        id,
        [SYMBOLS.isDirective]: SYMBOLS.isDirective,
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
