import { createComponentFragment } from '../component/create-component-fragment';
import { createPrimitiveFragment } from '../internals/create-primitive-fragment';
import { createReactiveFragment } from '../internals/create-reactive-fragment';
import type { Fragment } from '../internals/fragment';
import { isPrimitiveValue } from '../internals/is-primitive-value';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import type { Subscribable } from '../internals/subscribable';
import { trimWhitespace } from '../internals/trim-whitespace';

const parseTemplateFragment = (fragment: string | number | boolean | null | undefined | Subscribable | Fragment) => {
    switch (true) {
        case fragment == null:
            return null;
        case isSubscribableValue(fragment):
            return createReactiveFragment(fragment);
        case isPrimitiveValue(fragment):
            return createPrimitiveFragment(fragment);
        default:
            return fragment;
    }
};

/**
 * Parses a provided html string representation into a `ComponentFragment`,
 * which is a basic hydratable fragment to use in templates or applications
 *
 * @param stringFragments
 * @param valueFragments
 */
export const templateParser = (
    stringFragments: TemplateStringsArray,
    ...valueFragments: (string | number | boolean | null | undefined | Subscribable | Fragment)[]
) => {
    const fragments = new Map<string, Fragment>();

    const template = stringFragments.flatMap((strFragment, idx) => {
        return [
            {
                id: '',
                resolve: () => trimWhitespace(strFragment),
                render: () => strFragment,
                hydrate: (_: Node) => {},
            },
            ((): Fragment | null => {
                const fragment = parseTemplateFragment(valueFragments[idx]);
                if (fragment && 'id' in fragment) {
                    fragments.set(fragment.id, fragment);
                }

                return fragment;
            })(),
        ];
    });

    return createComponentFragment(
        template.filter((fragment) => !!fragment),
        fragments,
    );
};
