import { disconnectNodes } from '../application/lifecycle-observer';
import type { ComponentFragment } from '../component/component-fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import type { Subscribable } from '../internals/subscribable';
import { createStruct } from './create-struct';

/**
 * Struct to display elements conditionally.
 *
 * @param conditional
 * @param fulfilled
 */
export const $if = (conditional: Subscribable<boolean> | (() => boolean), fulfilled: () => ComponentFragment) => {
    // We get the initial conditional value. Before we setup the subscription
    // if applicable, we can render the value statically based on the
    // here provided value.
    const initial = conditional();
    const nodes = new Map<boolean, () => Element[]>([[true, () => hydrateFragment(fulfilled())]]);

    const struct = (root: Comment) => {
        const currentNodes = nodes.get(initial);
        let evaluated = currentNodes?.() ?? [];
        root.before(...evaluated);

        if (isSubscribableValue(conditional)) {
            return conditional.subscribe((value) => {
                disconnectNodes(evaluated);
                evaluated = nodes.get(value)?.() ?? [];
                root.before(...evaluated);
            });
        }
    };

    return Object.assign(createStruct(struct), {
        $else: (show: () => ComponentFragment) => {
            nodes.set(false, () => hydrateFragment(show()));
            return createStruct(struct);
        },
    });
};
