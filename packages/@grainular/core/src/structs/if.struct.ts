import type { Subscribable, TemplateResult } from '../component/template-parser';
import { disconnectNodes } from '../internals/disconnect-nodes';
import { hydrateTemplate } from '../internals/hydrate-template.ts';
import { isSubscribable } from '../internals/is-subscribable';
import { createStruct } from './create-struct';

export const $if = (conditional: Subscribable<boolean> | (() => boolean), fulfilled: () => TemplateResult) => {
    // We get the initial conditional value. Before we setup the subscription
    // if applicable, we can render the value statically based on the
    // here provided value.
    const initial = conditional();
    const nodes = new Map<boolean, () => Element[]>([[true, () => hydrateTemplate(fulfilled())]]);

    const struct = (root: Comment) => {
        const currentNodes = nodes.get(initial);
        let evaluated = currentNodes?.() ?? [];
        root.before(...evaluated);

        if (isSubscribable(conditional)) {
            return conditional.subscribe((value) => {
                disconnectNodes(evaluated);
                evaluated = nodes.get(value)?.() ?? [];
                root.before(...evaluated);
            });
        }
    };

    return Object.assign(createStruct(struct), {
        $else: (show: () => TemplateResult) => {
            nodes.set(false, () => hydrateTemplate(show()));
            return createStruct(struct);
        },
    });
};
