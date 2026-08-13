import type { Subscribable } from '../application/subscribable';
import type { Fragment } from './fragment';
import { createIdentifier } from './identifier';

// Creates a reactive fragment, that also updates the hydrated
// node on update of the subscribable
export const createReactiveFragment = (fragmentValue: Subscribable): Fragment => {
    const fragmentId = createIdentifier();
    return {
        fragmentId: fragmentId,
        resolve: () => `<!--${fragmentId.get()}-->`,
        render: () => String(fragmentValue() ?? ''),
        hydrate: (node: Node, { binding, lifecycle }) => {
            if (node instanceof Comment) {
                const text = new Text(String(fragmentValue() ?? ''));
                node.replaceWith(text);

                const onDestroy = fragmentValue.subscribe((value) => {
                    text.textContent = String(value ?? '');
                });

                if (onDestroy) lifecycle.trackUnmount(text, onDestroy);
            }

            if (node instanceof Element) {
                binding?.(fragmentValue() ?? '');

                const onDestroy = fragmentValue.subscribe((value) => {
                    binding?.(value ?? '');
                });

                if (onDestroy) lifecycle.trackUnmount(node, onDestroy);
            }
        },
    };
};
