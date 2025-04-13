/** @format */

import type { ComponentFragment } from './component-fragment'

export type ComponentProps = Record<PropertyKey, unknown>
export type PropsWithChildren<T extends ComponentProps = Record<PropertyKey, unknown>> = {
    children: string | ComponentFragment | null
} & T
