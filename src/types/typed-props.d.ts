/** @format */

import { ComponentProps } from './component-props';
import { LifecycleFunc } from './lifecycle-func';

export type TypedProps<P extends ComponentProps> = P & {
    $onMount: LifecycleFunc;
    $onDestroy: LifecycleFunc;
    $children: NodeList;
};
