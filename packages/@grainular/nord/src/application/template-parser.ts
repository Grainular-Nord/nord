import { createComponentFragment } from '../component/create-component-fragment';
import { createPrimitiveFragment } from '../internals/create-primitive-fragment';
import { createReactiveFragment } from '../internals/create-reactive-fragment';
import { FRAGMENT_ID, type Fragment } from '../internals/fragment';
import { isPrimitiveValue } from '../internals/is-primitive-value';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import { trimWhitespace } from '../internals/trim-whitespace';
import type { Subscribable } from './subscribable';

const parseTemplateFragment = (
    fragment: string | number | boolean | bigint | null | undefined | Subscribable | Fragment,
) => {
    switch (true) {
        case isSubscribableValue(fragment):
            return createReactiveFragment(fragment);
        case isPrimitiveValue(fragment) || fragment == null:
            return createPrimitiveFragment(fragment ?? '');
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
    ...valueFragments: (string | number | boolean | bigint | null | undefined | Subscribable | Fragment)[]
) => {
    const fragments: Fragment[] = [];

    const template = stringFragments.flatMap((strFragment, idx) => {
        return [
            trimWhitespace(strFragment),
            ((): string => {
                const fragment = parseTemplateFragment(valueFragments[idx]);
                if (FRAGMENT_ID in fragment) {
                    fragment[FRAGMENT_ID].create(String(idx));
                }
                fragments.push(fragment);
                return fragment.resolve();
            })(),
        ];
    });

    return createComponentFragment(template.flat(), fragments);
};
