import { lifecycleObserver } from '../application/lifecycle-observer';
import { FRAGMENT_ID, type Fragment } from '../internals/fragment';
import { createIdentifier } from '../internals/identifier';
/**
 * `createStruct` is the lower-level counterpart to `createDirective` — where
 * directives target `Element` nodes, structs target `Comment` nodes and are
 * used to manage dynamic regions of the DOM such as conditional blocks,
 * lists, and async content.
 *
 * A struct resolves to an HTML comment anchor in the template, which is then
 * used as a positional reference for inserting and removing nodes at runtime.
 *
 * ```ts
 * const myStruct = createStruct((anchor) => {
 *     const node = document.createElement('p');
 *     node.textContent = 'Hello';
 *     anchor.before(node);
 *
 *     return () => node.remove();
 * });
 *
 * html`${myStruct}`;
 * ```
 *
 * If the handler returns a function, it is registered as a cleanup callback
 * and called when the anchor is removed from the DOM.
 */

/**
 * Creates a struct fragment that manages a dynamic DOM region via a comment anchor.
 *
 * @param {(node: Comment) => void | (() => void)} struct - A function called
 * with the comment anchor on hydration. May return a cleanup function that runs
 * when the anchor is removed from the DOM.
 * @param {() => string} [snapshot] - An optional function returning an HTML
 * string for SSR snapshots. Defaults to an empty string.
 *
 * @returns {Fragment} A fragment that resolves to a comment anchor in the
 * template and hydrates the struct when mounted.
 *
 * @example
 * ```ts
 * const myStruct = createStruct(
 *     (anchor) => {
 *         const node = document.createElement('p');
 *         node.textContent = 'Hello';
 *         anchor.before(node);
 *         return () => node.remove();
 *     },
 *     () => '<p>Hello</p>',
 * );
 * ```
 */
export const createStruct = (
    struct: (node: Comment) => void | (() => void),
    snapshot: () => string = () => '',
): Fragment => {
    const fragmentId = createIdentifier();
    return {
        [FRAGMENT_ID]: fragmentId,
        resolve: () => `<!--${fragmentId.get()}-->`,
        render: () => snapshot(),
        hydrate: (node: Node) => {
            if (node instanceof Comment) {
                const onDestroy = struct(node);
                if (onDestroy) lifecycleObserver.trackUnmount(node, onDestroy);
            }
        },
    };
};
