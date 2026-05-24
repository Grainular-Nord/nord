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

/**
 * A `StylableFragment` extends `ComponentFragment` with a `css` method,
 * allowing scoped styles to be attached to a component. The `css` method
 * returns a plain `ComponentFragment`, so styles can only be applied once
 * per component.
 *
 * ```ts
 * const App = (): StylableFragment => html`<p>Hello</p>`.css`
 *     p { color: red; }
 * `;
 * ```
 */
export type StylableFragment = ComponentFragment & {
    css: (str: TemplateStringsArray, ...fragments: (string | number | boolean)[]) => ComponentFragment;
};
