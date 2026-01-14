import { disconnectNodes } from '../application/lifecycle-observer';
import type { ComponentFragment } from '../component/component-fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import type { Subscribable } from '../internals/subscribable';
import { createStruct } from './create-struct';

export const $render = (source: Subscribable<ComponentFragment | ComponentFragment>) => {
    return createStruct(
        (node) => {
            let nodes: Element[] = [];

            const render = (maybeFragment: (() => ComponentFragment) | ComponentFragment) => {
                disconnectNodes(nodes);

                const fragment = typeof maybeFragment === 'function' ? maybeFragment() : maybeFragment;
                nodes = hydrateFragment(fragment);

                node.before(...nodes);
            };

            render(source());
            const ondestroy = source.subscribe(render);

            return () => {
                ondestroy?.();
                disconnectNodes(nodes);
                nodes = [];
            };
        },
        () => {
            return source().render();
        },
    );
};
