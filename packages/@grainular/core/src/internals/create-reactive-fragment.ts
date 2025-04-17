import type { Subscribable } from '../component/template-parser';
import { deletionObserver } from './deletion-observer';
import type { Fragment } from './fragment';
import { identifier } from './identifier';
import type { AttributeControlledNode } from './track-attribute-node';

export const createReactiveFragment = (subscribable: Subscribable): Fragment => {
    const id = identifier();
    return {
        id,
        resolve: () => `<!--:${id}:-->`,
        hydrateClient: (node) => {
            let unsubscribe: void | (() => void);

            // If we have a comment, hydration is
            // straightforward. We create a text node, replace the comment
            // with it, and set up subscription and un subscription
            if (node instanceof Comment) {
                const text = document.createTextNode(`${subscribable()}`);
                node.replaceWith(text);
                unsubscribe = subscribable.subscribe((value) => {
                    text.textContent = `${value}`;
                });
            }

            // We also need to do a similar thing for elements, where we need to
            // check for attribute values containing the id, and then setup correct
            // string replacement operations
            if (
                ((node: Node): node is AttributeControlledNode =>
                    node instanceof HTMLElement && 'updateAttribute' in node)(node)
            ) {
                node.updateAttribute(id, subscribable());
                unsubscribe = subscribable.subscribe((value) => {
                    node.updateAttribute(id, value);
                });
            }

            deletionObserver.track(node, () => unsubscribe?.());
        },
        hydrateServer: (html) => {},
    };
};
