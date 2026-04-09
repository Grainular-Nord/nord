import { lifecycleObserver } from '../application/lifecycle-observer';
import { FRAGMENT_ID, type Fragment } from './fragment';
import { createIdentifier } from './identifier';
import type { Subscribable } from './subscribable';

// Creates a reactive fragment, that also updates the hydrated
// node on update of the subscribable
export const createReactiveFragment = (fragmentValue: Subscribable): Fragment => {
    const fragmentId = createIdentifier();
    return {
        [FRAGMENT_ID]: fragmentId,
        resolve: () => `<!--${fragmentId.get()}-->`,
        render: () => String(fragmentValue() ?? ''),
        hydrate: (node: Node, { binding } = {}) => {
            if (node instanceof Comment) {
                const text = new Text(String(fragmentValue() ?? ''));
                node.replaceWith(text);

                const onDestroy = fragmentValue.subscribe((value) => {
                    text.textContent = String(value ?? '');
                });

                if (onDestroy) lifecycleObserver.trackUnmount(text, onDestroy);
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
