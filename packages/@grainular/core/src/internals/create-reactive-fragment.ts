import { lifecycleObserver } from '../application/lifecycle-observer';
import { updateAttributeValue } from './attribute-bindings';
import type { Fragment } from './fragment';
import { identifier } from './identifier';
import type { Subscribable } from './subscribable';

// Creates a reactive fragment, that also updates the hydrated
// node on update of the subscribable
export const createReactiveFragment = (fragmentValue: Subscribable, id = identifier()): Fragment => {
    return {
        id,
        resolve: () => `<!--:${id}:-->`,
        render: () => String(fragmentValue() ?? ''),
        hydrate: (node: Node) => {
            if (node instanceof Comment) {
                const text = new Text(String(fragmentValue() ?? ''));
                node.replaceWith(text);

                const onDestroy = fragmentValue.subscribe((value) => {
                    text.textContent = String(value ?? '');
                });

                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }

            if (node instanceof Element) {
                updateAttributeValue(id, fragmentValue() ?? '');

                const onDestroy = fragmentValue.subscribe((value) => {
                    updateAttributeValue(id, value ?? '');
                });

                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
