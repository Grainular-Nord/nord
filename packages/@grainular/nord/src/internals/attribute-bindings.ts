const nodeState = new WeakMap<Element, Map<string, string[]>>();
const booleanAttributes = /^(disabled|checked|readonly|required|hidden|open|selected|autofocus|multiple)$/;

/**
 * Creates a binding and returns a direct update function.
 * No global IDs required.
 */
export const createAttributeBinding = (
    node: Element,
    attributeName: string,
    marker: string, // The specific marker to find (e.g. "nø-000001")
    initialParts: string[], // The split array
) => {
    // We get the current stored binding for the
    // node, allowing us to check all existing
    // bindings for the node. If no binding exist,
    // we create a new one
    let bindings = nodeState.get(node);
    if (!bindings) {
        bindings = new Map<string, string[]>();
        nodeState.set(node, bindings);
    }

    // Retrieve the attribute fragments that have
    // been already set.
    let parts = bindings.get(attributeName);
    if (!parts) {
        parts = initialParts;
        bindings.set(attributeName, parts);
    }

    const isBoolean = booleanAttributes.test(attributeName);
    const partIndex = parts.indexOf(marker);
    if (partIndex === -1) return () => {};

    // We create a fn that acts as binding and is
    // passed back to the hydrator fn allowing to directly
    // bind without any kind of shared update functionality
    return (value: unknown) => {
        parts[partIndex] = String(value);
        const attributeValue = parts.join('');

        // Handle non boolean update
        if (!isBoolean) {
            node.setAttribute(attributeName, attributeValue);
            return;
        }

        // Handle ugly boolean attribute update
        attributeValue === 'false' || !attributeValue
            ? node.removeAttribute(attributeName)
            : node.setAttribute(attributeName, '');
    };
};
