import { html } from '..';
import { createComponentFragment } from '../component/create-component-fragment';
import { createPrimitiveFragment } from '../internals/create-primitive-fragment';
import { createReactiveFragment } from '../internals/create-reactive-fragment';
import type { Fragment } from '../internals/fragment';
import { isPrimitiveValue } from '../internals/is-primitive-value';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import { $each } from '../structs/each.struct';
import type { Subscribable } from './subscribable';

const parseTemplateFragment = (
    fragment: string | number | boolean | bigint | null | undefined | Subscribable | Fragment | Fragment[],
) => {
    switch (true) {
        // For static fragment lists, we can interop them internally
        // into a single fragment, allowing patterns like
        // `<div>${list.map((value) => Fragment(value))}</div>`
        // It's basically a shortcut utilizing a recursive template struct
        case Array.isArray(fragment):
            return $each(() => fragment).$as((fragment) => html`${fragment}`);
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
    ...valueFragments: (string | number | boolean | bigint | null | undefined | Subscribable | Fragment | Fragment[])[]
) => {
    const fragments: Fragment[] = [];

    const template = stringFragments.flatMap((strFragment, idx) => {
        return [
            strFragment,
            ((): string => {
                const fragment = parseTemplateFragment(valueFragments[idx]);
                if ('fragmentId' in fragment) {
                    fragment.fragmentId.create(String(idx));
                }
                fragments.push(fragment);
                return fragment.resolve();
            })(),
        ];
    });

    return createComponentFragment(template.flat(), fragments);
};
