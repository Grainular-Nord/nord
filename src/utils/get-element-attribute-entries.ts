/** @format */

import { isNonNull } from './is-non-null';

export const getElementAttributeEntries = (node: Element) => [
    ...node.getAttributeNames().flatMap((name) => [name, node.getAttribute(name) ?? '']),
];
