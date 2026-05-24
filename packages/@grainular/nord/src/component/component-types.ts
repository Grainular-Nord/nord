import type { ComponentFragment, StylableFragment } from './component-fragment';

/**
 * The base type for component props. Any record with arbitrary keys and
 * unknown values. Used as the constraint for all component prop generics.
 */
export type ComponentProps = Record<PropertyKey, unknown>;

/**
 * Extends a props type with a `children` field, allowing a component to
 * accept child content passed from a parent template.
 *
 * ```ts
 * const Card = ({ children }: PropsWithChildren): ComponentFragment =>
 *     html`<div class="card">${children}</div>`;
 * ```
 *
 * `children` may be a string, a `ComponentFragment`, a `StylableFragment`,
 * or `null` if no children are provided.
 */
export type PropsWithChildren<T extends ComponentProps = Record<PropertyKey, unknown>> = {
    children: string | ComponentFragment | StylableFragment | null;
} & T;

/**
 * Describes a Nord component — a function that returns a `ComponentFragment`.
 *
 * This type is a convention, not a constraint. Any function returning a
 * `ComponentFragment` is a valid component; `PureComponent` exists to
 * give component definitions a consistent, readable shape.
 *
 * If `T` is `undefined`, the component takes no props. Otherwise it takes
 * a props object of type `T`.
 *
 * ```ts
 * const App: PureComponent = () => html`<p>Hello</p>`;
 *
 * const Greeting: PureComponent<{ name: string }> = ({ name }) =>
 *     html`<p>Hello, ${name}</p>`;
 * ```
 */
export type PureComponent<T extends ComponentProps | undefined = undefined> = T extends undefined
    ? () => ComponentFragment
    : (props: T) => ComponentFragment;
