import type { Fragment } from '../internals/fragment';
import type { SYMBOLS } from '../internals/symbols';

export type DirectiveFragment = Fragment & {
    [SYMBOLS.isDirective]: typeof SYMBOLS.isDirective;
};
