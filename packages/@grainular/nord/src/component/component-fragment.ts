import type { Fragment } from '../internals/fragment';

/**
 * A marker symbol used to identify `ComponentFragment` instances at the
 * type level. Attached to all fragments created by the template parser.
 */
export const IS_COMPONENT: unique symbol = Symbol.for('nord.component');

/**
 * A `ComponentFragment` is the primary unit of renderable output in Nord.
 * It extends `Fragment` with a marker symbol that identifies it as the
 * product of the template parser, distinguishing it from lower-level
 * fragments such as directives and structs.
 *
 * All components return a `ComponentFragment`:
 *
 * ```ts
 * const App = (): ComponentFragment => html`<p>Hello</p>`;
 * ```
 */
export type ComponentFragment = Fragment & {
    [IS_COMPONENT]: true;
};
