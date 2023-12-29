/** @format */

export const isolateAttributeNodes = (element: Element, attributeName: string, token: string) => {
    const splitAttributeNode = (string: string, token: string) => {
        const [start, tail] = string.split(token);
        return [start, token, tail];
    };

    // If the map doesn't exist on the element yet, create one
    // All attributes existing on the element are then parsed into the map
    if (!element.attributeMap) {
        element.attributeMap = new Map<string, string[]>([
            ...element.getAttributeNames().map((name) => [name, [element.getAttribute(name)]] as [string, string[]]),
        ]);
    }

    if (element.attributeMap.has(attributeName)) {
        const [...attributeValues] = element.attributeMap.get(attributeName)!;
        const [remaining, ...parsed] = attributeValues.reverse();
        element.attributeMap.set(attributeName, [...parsed.reverse(), ...splitAttributeNode(remaining ?? '', token)]);
    }
};
