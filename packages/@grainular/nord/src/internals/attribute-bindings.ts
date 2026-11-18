import { escapeHtml } from './escape-html';

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

export const attributeValue = (key: string, value: unknown): string | null => {
    if (value == null) return null;
    if (booleanAttributes.has(key.toLowerCase())) return value === 'false' || !value ? null : '';
    return String(value);
};

export const setAttribute = (node: Element, key: string, value: unknown) => {
    const normalized = attributeValue(key, value);
    normalized === null ? node.removeAttribute(key) : node.setAttribute(key, normalized);
};

export const renderAttribute = (key: string, value: unknown) => {
    const normalized = attributeValue(key, value);
    return normalized === null ? '' : ` ${key}="${escapeHtml(normalized)}"`;
};

/**
 * Creates a binding and returns a direct update function.
 * No global IDs required.
 */
export const createAttributeBinding = (
    node: Element,
    attributeName: string,
    marker: string, // The specific marker to find (e.g. "nø-000001")
    attributeFragments: string[], // The split array
) => {
    // Get the node's existing bindings or create
    // a map for its attribute bindings.
    const bindings = nodeState.getOrInsertComputed(node, () => new Map<string, string[]>());

    // Get the attribute's existing fragments or
    // store the initial fragments for later updates.
    const parts = bindings.getOrInsert(attributeName, attributeFragments);

    const partIndex = parts.indexOf(marker);
    if (partIndex === -1) return () => {};

    // We compute once if the attribute value is multipart
    // or just a singluar value. Depending on that computation,
    // and the concern, the attr is either removed or set ''
    const isExpandedAttributeValue = attributeFragments.join('') === marker;

    // We create a fn that acts as binding and is
    // passed back to the hydrator fn allowing to directly
    // bind without any kind of shared update functionality
    return (value: unknown) => {
        parts[partIndex] = String(value ?? '');
        setAttribute(node, attributeName, isExpandedAttributeValue ? value : parts.join(''));
    };
};
