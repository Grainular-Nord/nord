const nodeState = new WeakMap<Element, Map<string, string[]>>();
const booleanAttributes = new Set([
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'inert',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected',
]);

export const setAttribute = (node: Element, key: string, value: unknown) => {
    const isBoolean = booleanAttributes.has(key.toLowerCase());

    // Handle non boolean update
    if (!isBoolean) {
        node.setAttribute(key, String(value));
        return;
    }

    // Handle ugly boolean attribute update
    value === 'false' || !value ? node.removeAttribute(key) : node.setAttribute(key, '');
};

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

    const partIndex = parts.indexOf(marker);
    if (partIndex === -1) return () => {};

    // We create a fn that acts as binding and is
    // passed back to the hydrator fn allowing to directly
    // bind without any kind of shared update functionality
    return (value: unknown) => {
        parts[partIndex] = String(value);
        const attributeValue = parts.join('');
        setAttribute(node, attributeName, attributeValue);
    };
};
