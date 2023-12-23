/** @format */

export const getAttributeNameForValue = (node: Element, value: string) =>
    ([...node.getAttributeNames().map((name) => [name, node.getAttribute(name) ?? ''])].find(
        ([, val]) => value === val
    ) ?? [])[0];
