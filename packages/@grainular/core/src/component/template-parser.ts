// We use this type to interface with grains. Not specifying grains here
// allows us to skip @grainular/grains as dependency (even peer) and let's

import { createDirectiveFragment } from '../directives/create-directive-fragment';
import { type Directive, isDirective } from '../directives/directive';
import { createPrimitiveFragment } from '../internals/create-primitive-fragment';
import { createReactiveFragment } from '../internals/create-reactive-fragment';
import { isSubscribable } from '../internals/is-subscribable';
import { createStructFragment } from '../structs/create-struct-fragment';
import { type Struct, isStruct } from '../structs/struct';
import { type ComponentFragment, createComponentFragment, isComponent } from './component-fragment';
import type { Fragment } from './fragment';

/**
 * INTERNAL: DO NOT USE OR ACCESS.
 */
export const fragmentMap = new Map<string, Fragment>();

export type TemplateResult = ComponentFragment | string | null;

// Providing a more open type here allows the user or dev
// to implement it's own readonly reactive state mechanism.
export type Subscribable<V = unknown> = {
    (): V;
    subscribe: (subscriber: (value: V) => void) => void | (() => void);
};

/**
 * We use this internal function to create a fragment (Or at least part of it)
 * For the template creation, we only care about being resolvable. The pattern
 * here could be shortened by widening the return type to string | number | boolean | Fragment,
 * but that would lead to more overhead later on.
 */
const createFragment = (
    data: string | number | boolean | null | Subscribable | Directive | Struct | ComponentFragment | undefined,
) => {
    // If there is no data, or the data is null or (possibly) undefined,
    // we return null and indicate that this is a value that should be
    // removed from the template all together.
    if (!data) {
        return null;
    }

    // Otherwise, we try to find and assert the correct fragment
    // type, falling back to a more generic resolve if no matching
    // fragment is found.
    switch (true) {
        case isComponent(data):
            return data;
        case isDirective(data):
            return createDirectiveFragment(data);
        case isStruct(data):
            return createStructFragment(data);
        case isSubscribable(data):
            return createReactiveFragment(data);
        default:
            // All other values are returned as primitive Fragment
            // that coerces the data into a string type.
            return createPrimitiveFragment(data);
    }
};

export const templateParser = (
    strings: TemplateStringsArray,
    ...fragments: (string | number | boolean | null | Subscribable | Directive | Struct | ComponentFragment)[]
) => {
    const template = strings.flatMap((str, idx) => {
        return [
            // We can directly assume and create a resolver
            // for each iteration step, as we iterate as long
            // as there are strings to iterate.
            {
                resolve: () => str,
            },
            // We then need to create and resolve the data
            // fragment. If there is no fragment, we return
            // empty and filter after. If it is a hydratable
            // fragment, we also add it to the fragment map
            (() => {
                const data = fragments.at(idx);
                const fragment = createFragment(data);

                if (fragment && 'id' in fragment) {
                    fragmentMap.set(fragment.id, fragment);
                }

                return fragment;
            })(),
        ];
    });

    return createComponentFragment(template.filter((v) => !!v));
};
