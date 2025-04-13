import { Symbols } from '../internals/symbols'

export type Struct = {
    [Symbols.STRUCT]: true
    (node: Comment): void | (() => void)
}

export const isStruct = (value: unknown): value is Struct => {
    return value !== null && typeof value === 'function' && Symbols.STRUCT in value
}
