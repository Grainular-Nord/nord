import { lifecycleObserver } from '../application/lifecycle-observer';

const attributeMap = new Map<string, (value: unknown) => void>();
const nodeState = new WeakMap<Element, Map<string, string[]>>();
const booleanAttributes = /^(disabled|checked|readonly|required|hidden|open|selected|autofocus|multiple)$/;

/**
 * Method to update a attribute by it's fragment id
 * with a new value.
 *
 * @param id
 * @param value
 */
export const updateAttributeValue = (id: string, value: unknown) => {
    attributeMap.get(id)?.(value);
};

/**
 * @note internal use only
 * Creates a attribute binding between node, attribute and fragment id,
 * and also creates a closure to update the attribute efficiently.
 *
 * @param node
 * @param attributeName
 * @param fragmentId
 * @param fragments
 */
export const createAttributeBinding = (
    node: Element,
    attributeName: string,
    fragmentId: string,
    fragments: string[],
) => {
    // Check if a binding for the node and attribute name already exists
    // if not, create and assign one.
    let bindings = nodeState.get(node);
    if (!bindings) {
        bindings = new Map<string, string[]>();
        nodeState.set(node, bindings);
    }

    // Get the created fragments array, either
    // from the previous binding or by the
    // previous parsing passed to the fn
    const fragmentsArray = bindings.get(attributeName) ?? fragments;
    bindings.set(attributeName, fragmentsArray);

    // Get the index of the current Fragment
    const fragmentIdx = fragmentsArray.findIndex((fragment) => {
        return fragment === fragmentId;
    });

    attributeMap.set(fragmentId, (value: unknown) => {
        // Update the fragments array, that is store
        // in our bindings map, before recreating the
        // correct attribute string
        fragmentsArray[fragmentIdx] = String(value);
        const attributeValue = fragmentsArray.join('');

        // Handle non boolean attribute commit to dom
        if (!booleanAttributes.test(attributeName)) {
            return node.setAttribute(attributeName, attributeValue);
        }

        // Handle boolean attribute commit to dom
        attributeValue === 'false' ? node.removeAttribute(attributeName) : node.setAttribute(attributeName, '');
    });

    // Track the node, and if it unmounts, delete
    // the binding to no longer retain a reference to it
    // this prevents a major memory leak.
    lifecycleObserver.trackUnmount(node, () => {
        attributeMap.delete(fragmentId);
    });
};
