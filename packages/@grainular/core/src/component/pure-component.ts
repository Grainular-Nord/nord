/** @format */

import type { ComponentFragment } from './component-fragment'
import type { ComponentProps } from './component-props'

export type PureComponent<T extends ComponentProps | undefined = undefined> = T extends undefined
    ? () => ComponentFragment
    : (props: T) => ComponentFragment
