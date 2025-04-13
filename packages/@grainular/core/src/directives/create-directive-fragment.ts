import type { Fragment } from '../component/fragment'
import { identifier } from '../internals/identifier'
import type { Directive } from './directive'

export const createDirectiveFragment = (directive: Directive): Fragment => {
    const id = identifier()
    return {
        id,
        resolve: () => id,
        hydrateClient: (node: Node) => {
            if (node instanceof HTMLElement) {
                return directive(node)
            }

            throw new TypeError('Directives cannot be applied to non element nodes.')
        },
        hydrateServer: () => {},
    }
}
