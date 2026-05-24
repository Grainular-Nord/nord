import { createDirective } from './create-directive';

/**
 * A `Ref` holds a reference to a DOM element, populated when the target
 * element is hydrated. Before hydration, `current` is `null`.
 *
 * ```ts
 * const inputRef = createRef<HTMLInputElement>();
 *
 * html`<input ${ref(inputRef)} type="text" />`;
 *
 * inputRef.current; // HTMLInputElement
 * ```
 */
export type Ref<T extends Element> = { current: T | null };

/**
 * Creates an empty `Ref` object to be populated by the `ref` directive.
 *
 * @template T - The type of element the ref will hold.
 *
 * @returns {Ref<T>} A ref object with `current` initialised to `null`.
 */
export const createRef = <T extends Element>(): Ref<T> => ({ current: null });

/**
 * A directive that populates a `Ref` with the target element on hydration.
 * The ref does not need to be created with `createRef` — any object matching
 * the `Ref<T>` shape is valid.
 *
 * @template T - The type of element the ref will hold.
 *
 * @param {Ref<T>} ref - The ref object to populate.
 *
 * @returns {Fragment} A directive fragment attachable to elements in a template.
 *
 * @example
 * ```ts
 * const inputRef = createRef<HTMLInputElement>();
 *
 * html`<input ${ref(inputRef)} type="text" />`;
 *
 * mounted(() => {
 *     inputRef.current?.focus();
 * });
 * ```
 */
export const ref = <T extends Element>(ref: Ref<T>) => {
    return createDirective((node: Element) => {
        ref.current = node as T;
    });
};
