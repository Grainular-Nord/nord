import { Symbols } from '../internals/symbols'

export type Directive = {
    [Symbols.DIRECTIVE]: true
    (node: HTMLElement): void | (() => void)
}
export const isDirective = (unknown: unknown): unknown is Directive => {
    return unknown !== null && typeof unknown === 'function' && Symbols.DIRECTIVE in unknown
}
