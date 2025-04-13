import type { ComponentFragment } from '../component/component-fragment';
import type { Subscribable } from '../component/template-parser';
import { DOM } from '../internals/dom';
import { isSubscribable } from '../internals/is-subscribable';
import { Symbols } from '../internals/symbols';

export const $if = (
    conditional: Subscribable<boolean> | (() => boolean),
    truthy: ComponentFragment | string | null,
) => {
    const initial = conditional();
    const nodes = new Map<boolean, DocumentFragment | null>([[true, DOM.getHydratedFragment(truthy) ?? null]]);
    const struct = (root: Comment) => {
        root.textContent += '$if:';
        let currentNodes = DOM.insertFragment(root, nodes.get(initial));

        if (isSubscribable(conditional)) {
            conditional.subscribe((value) => {
                queueMicrotask(() => {
                    DOM.removeNodes(currentNodes);
                    currentNodes = DOM.insertFragment(root, nodes.get(value));
                });
            });
        }
    };

    return Object.assign(struct, {
        [Symbols.STRUCT]: true as const,
        $else: (falsy: ComponentFragment | string | null) => {
            nodes.set(false, DOM.getHydratedFragment(falsy) ?? null);
            return Object.assign(struct, {
                [Symbols.STRUCT]: true as const,
            });
        },
    });
};
