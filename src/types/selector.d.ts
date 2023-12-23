/** @format */

export type Selector<S extends string> = S extends Capitalize<S> ? S : 'TypeError: Selectors need to be capitalized.';
