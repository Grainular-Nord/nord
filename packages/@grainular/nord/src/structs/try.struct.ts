import { disconnectNodes } from '../application/lifecycle-observer';
import type { ComponentFragment } from '../component/component-fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createStruct } from './create-struct';

export const $try = (render: () => ComponentFragment) => {
    return {
        $catch: (fallback: (error: unknown) => ComponentFragment) => {
            return createStruct(
                (node) => {
                    let nodes: Element[] = [];

                    try {
                        nodes = hydrateFragment(render());
                    } catch (e: unknown) {
                        nodes = hydrateFragment(fallback(e));
                    } finally {
                        node.replaceWith(...nodes);
                    }

                    return () => {
                        disconnectNodes(nodes);
                        nodes = [];
                    };
                },
                () => {
                    try {
                        return render().render();
                    } catch (e) {
                        return fallback(e).render();
                    }
                },
            );
        },
    };
};
