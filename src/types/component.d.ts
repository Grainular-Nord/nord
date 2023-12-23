/** @format */

import { ComponentProps } from './component-props';

export type Component = <Props extends ComponentProps>(props: P, children?: NodeList) => NodeList;
