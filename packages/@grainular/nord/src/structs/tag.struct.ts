import { templateParser } from '../application/template-parser';
import type { PropsWithChildren } from '../component/component-types';
import type { Fragment } from '../internals/fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createStruct } from './create-struct';

/**
 * `$tag` is a struct for dynamically creating a typed HTML element with
 * children, directives, and an optional mount callback. It is primarily
 * useful when the tag name itself is dynamic or when programmatic control
 * over element creation is needed.
 *
 * ```ts
 * const isAdmin = grain(false);
 *
 * html`${$tag(
 *     { as: 'button', children: 'Click me', use: [on('click', handler)] },
 *     (node) => { node.focus(); },
 * )}`;
 * ```
 *
 * Directives passed via `use` are hydrated onto the element, meaning event
 * listeners and reactive bindings are set up and cleaned up correctly.
 */

/**
 * Options for configuring the element created by `$tag`.
 */
type TagOpts<T extends keyof HTMLElementTagNameMap> = {
    /** The HTML tag name to create. */
    as: T;
    /** Optional children to render inside the element. */
    children?: PropsWithChildren['children'];
    /** Optional directives to hydrate onto the element. */
    use?: Fragment[];
};

/**
 * Creates a struct that renders a typed HTML element with optional children,
 * directives, and a mount callback.
 *
 * @template T - A key of `HTMLElementTagNameMap`, inferred from `as`.
 *
 * @param {TagOpts<T>} options - Configuration for the element to create.
 * @param {(node: HTMLElementTagNameMap[T]) => (() => void) | void} [onMount] -
 * An optional callback invoked with the created element after it is inserted
 * into the DOM. May return a cleanup function called on unmount.
 *
 * @returns {Fragment} A struct fragment that creates and mounts the element.
 *
 * @example
 * ```ts
 * html`${$tag(
 *     { as: 'input', use: [attr({ type: 'text', placeholder: 'Search' })] },
 *     (node) => {
 *         node.focus();
 *         return () => console.log('input removed');
 *     },
 * )}`;
 * ```
 */
export const $tag = <T extends keyof HTMLElementTagNameMap>(
    { as, children, use = [] }: TagOpts<T>,
    onMount?: (node: HTMLElementTagNameMap[T]) => (() => void) | void,
) => {
    return createStruct((node) => {
        const element = document.createElement(as);
        element.append(...hydrateFragment(templateParser`${children}`));

        // Hydrate the fragment from the passed elements
        // This will directly register any eventual cleanup
        // that triggers once the node is removed from the DOM
        for (const fragment of use) {
            fragment.hydrate(element);
        }

        node.replaceWith(element);
        return onMount?.(element);
    });
};
