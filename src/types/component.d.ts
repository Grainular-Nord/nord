/** @format */

import { ComponentProps } from './component-props';

/**
 * This type represents the structure of functions that define components.
 * > Note: Components should always be created by the `createComponent` function
 *
 * @template Props - The type of properties that the component will accept. These properties should extend ComponentProps,
 *                   allowing for a flexible structure with various possible property names and types.
 *
 * @param {Props} props - The properties passed to the component. These are defined by the specific implementation
 *                        of the component and should adhere to the structure of ComponentProps.
 * @param {NodeList} [children] - An optional NodeList representing the child nodes of the component.
 *                                This allows for the inclusion of children elements or components within the component.
 *
 * @returns {NodeList} The function should return a NodeList representing the rendered output of the component.
 *                     This output is what will be inserted into the DOM when the component is rendered.
 *
 */

export type Component = <Props extends ComponentProps>(props: P, children?: NodeList) => NodeList;
