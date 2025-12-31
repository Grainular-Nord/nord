import { disconnectNodes } from '../application/lifecycle-observer';
import type { ComponentFragment } from '../component/component-fragment';
import type { Fragment } from '../internals/fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import type { Subscribable } from '../internals/subscribable';
import { createStruct } from './create-struct';

type CaseFn<T> = (value: T, render: () => ComponentFragment) => SwitchStruct<T>;
type SwitchStruct<T> = {
    $case: CaseFn<T>;
    $default: (render: () => ComponentFragment) => Fragment;
};

export const $switch = <T>(condition: Subscribable<T> | (() => T)): SwitchStruct<T> => {
    let defaultFragment: () => ComponentFragment;
    const current = new Set<Element>();
    const cases = new Map<T, () => ComponentFragment>();

    const struct = createStruct(
        (node) => {
            const render = (value: T) => {
                // Get the initial fragment and clear the current
                // set and nodes, so that all unmount run correctly
                const fragment = cases.get(value) ?? defaultFragment;
                disconnectNodes([...current.values()]);
                current.clear();

                // Hydrate the nodes, assign them to the nodes
                // set, and render them to the current anchor
                const nodes = hydrateFragment(fragment());
                node.before(...nodes);
                for (const node of nodes) current.add(node);
            };

            render(condition());

            if (isSubscribableValue(condition)) {
                const cleanup = condition.subscribe((value) => {
                    render(value);
                });

                return () => {
                    current.clear();
                    cleanup?.();
                };
            }
        },
        () => {
            const fragment = cases.get(condition()) ?? defaultFragment;
            return fragment().render();
        },
    );

    // Compose the elements for the respective return way

    const $default = (render: () => ComponentFragment) => {
        defaultFragment = render;
        return struct;
    };

    const $case: CaseFn<T> = (value: T, render: () => ComponentFragment) => {
        cases.set(value, render);
        return {
            $case,
            $default,
        };
    };

    return { $case, $default };
};
