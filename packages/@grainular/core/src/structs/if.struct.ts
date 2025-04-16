import type { Subscribable, TemplateResult } from '../component/template-parser';
import { isSubscribable } from '../internals/is-subscribable';
import { memoizeNodes } from '../internals/memoize-nodes';
import { createStruct } from './create-struct';

export const $if = (conditional: Subscribable<boolean> | (() => boolean), fulfilled: () => TemplateResult) => {
    // We get the initial conditional value. Before we setup the subscription
    // if applicable, we can render the value statically based on the
    // here provided value.
    const initial = conditional();
    const nodes = new Map<boolean, Element[]>([[true, memoizeNodes(fulfilled())]]);

    const struct = (root: Comment) => {
        let currentNodes = nodes.get(initial);
        root.before(...(currentNodes ?? []));

        if (isSubscribable(conditional)) {
            const unsubscribe = conditional.subscribe((value) => {
                // biome-ignore lint/complexity/noForEach:
                currentNodes?.forEach((node) => node?.remove());
                currentNodes = nodes.get(value);
                root.before(...(currentNodes ?? []));
            });

            return () => unsubscribe?.();
        }
    };

    return Object.assign(createStruct(struct), {
        $else: (show: () => TemplateResult) => {
            nodes.set(false, memoizeNodes(show()));
            return createStruct(struct);
        },
    });
};
