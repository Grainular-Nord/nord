import type { Fragment } from '../internals/fragment';
import type { SYMBOLS } from '../internals/symbols';

export type StructFragment = Fragment & {
    [SYMBOLS.isStruct]: typeof SYMBOLS.isStruct;
};
