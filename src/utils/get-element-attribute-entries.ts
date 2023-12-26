/** @format */
export const getElementAttributeEntries = (node: Element) => [
    ...node.getAttributeNames().flatMap((name) => [name, node.getAttribute(name) ?? '']),
];
