/** @format */

import type { ComponentProps } from './component-props'

export type VoidComponent<T extends ComponentProps | undefined = undefined> = T extends undefined
    ? () => null
    : (props: T) => null
