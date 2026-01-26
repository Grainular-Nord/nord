import { lifecycleObserver } from '../application/lifecycle-observer';
import type { Fragment } from './fragment';
import { createIdentifier } from './identifier';
import type { Subscribable } from './subscribable';

// Creates a reactive fragment, that also updates the hydrated
// node on update of the subscribable
export const createReactiveFragment = (fragmentValue: Subscribable): Fragment => {
    let id = '';
    return {
        id: () => id,
        assignIdentifier: (idx: number) => {
            id = createIdentifier(idx);
        },
        resolve: () => `<!--:${id}:-->`,
        render: () => String(fragmentValue() ?? ''),
        hydrate: (node: Node, { binding } = {}) => {
            if (node instanceof Comment) {
                const text = new Text(String(fragmentValue() ?? ''));
                node.replaceWith(text);

                const onDestroy = fragmentValue.subscribe((value) => {
                    text.textContent = String(value ?? '');
                });

                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }

            if (node instanceof Element) {
                binding?.(fragmentValue() ?? '');

                const onDestroy = fragmentValue.subscribe((value) => {
                    binding?.(value ?? '');
                });

                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
