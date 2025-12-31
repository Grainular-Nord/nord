import { createDirective } from './create-directive';

export type Ref<T extends Element> = { current: T | null };

/**
 * Create a Ref object to pass to the ref() directive.
 */
export const createRef = <T extends Element>(): Ref<T> => ({ current: null });

/**
 * Directive used to populate a `Ref<T>` object. A ref Object is any object
 * that is of type Ref<T>, independent of it's creation via `createRef` or
 * manual creation. After hydration, the ref is populated and can be accessed
 * via ref.current
 *
 * @param ref
 */
export const ref = <T extends Element>(ref: Ref<T>) => {
    return createDirective((node: Element) => {
        ref.current = node as T;
    });
};
