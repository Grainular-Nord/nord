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
    // 1. Shared State Management (The Coordinator)
    let bindings = nodeState.get(node);
    if (!bindings) {
        bindings = new Map<string, string[]>();
        nodeState.set(node, bindings);
    }

    // Reuse the existing state array if another fragment already initiated this attribute
    const parts = bindings.get(attributeName) ?? initialParts;
    bindings.set(attributeName, parts);

    // 2. Locate our "Slot"
    // Uniqueness is only required *within this single attribute string*,
    // which is guaranteed by the parser's index-based IDs.
    const partIndex = parts.indexOf(marker);
    if (partIndex === -1) return () => {};

    // 3. Create the Direct Update Closure
    const update = (value: unknown) => {
        parts[partIndex] = String(value);
        const attributeValue = parts.join('');

        if (!booleanAttributes.test(attributeName)) {
            node.setAttribute(attributeName, attributeValue);
            return;
        }

        if (attributeValue === 'false' || !attributeValue) {
            node.removeAttribute(attributeName);
        } else {
            node.setAttribute(attributeName, '');
        }
    };

    return update;
};
