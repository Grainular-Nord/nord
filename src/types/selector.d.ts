/** @format */

/**
 * This type ensures that selectors, typically used for registering components, are capitalized.
 *
 * @template S - A string type representing the selector.
 *
 * @returns {S | 'TypeError: Selectors need to be capitalized.'} The type will resolve to the string type `S` if it is
 *   capitalized. If `S` is not capitalized, the type resolves to a literal type with an error message,
 *   indicating that selectors must be capitalized. This helps in maintaining a consistent naming convention
 *   across the framework, especially for component selectors.
 *
 * @example
 * // Example of a valid capitalized selector
 * type ValidSelector = Selector<'MyComponent'>; // Resolves to 'MyComponent'
 *
 * // Example of an invalid selector, not capitalized
 * type InvalidSelector = Selector<'myComponent'>; // Resolves to 'TypeError: Selectors need to be capitalized.'
 *
 * // The Selector type can be used in component initialization to enforce this naming rule.
 */

export type Selector<S extends string> = S extends Capitalize<S> ? S : 'TypeError: Selectors need to be capitalized.';
