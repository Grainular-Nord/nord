import type { Fragment } from '../component/fragment';

const BOOLEAN_ATTRIBUTES = new Set([
    'disabled',
    'checked',
    'readonly',
    'required',
    'autofocus',
    'multiple',
    'selected',
    'hidden',
    'open',
]);

export type AttributeControlledNode = HTMLElement & {
    attributeMap: Map<string, Map<string, string>>;
    updateAttribute: (id: string, value: unknown) => void;
};

// Attributes should be settable by subscribables directly
// on the dom node. We'll provide an api that allows
// them to set a new value using just their id and value, abstracting
// away the need to track the name, position or other values of the
// attribute.
export const trackAttributeNode = (node: HTMLElement, attribute: string, fragments: Fragment[]) => {
    // There is some additional logic involved in setting attributes,
    // as we need to check and infer for boolean attributes.
    const setAttributeValueOnNode = (node: HTMLElement, value: Map<string, string>) => {
        // We infer the attribute value and check if we can
        // set the attribute with the value, in case we're not
        // in a boolean attribute.
        const attrValue = [...value.values()].join('').trim();
        if (!BOOLEAN_ATTRIBUTES.has(attribute)) {
            return node.setAttribute(attribute, attrValue);
        }

        // if we are, we check for no value or 'false' as value.
        // If so, we remove the attribute, otherwise we set it.
        if (!attrValue || attrValue === 'false') {
            return node.removeAttribute(attribute);
        }

        return node.setAttribute(attribute, '');
    };

    if (!('attributeMap' in node)) {
        Object.assign(node, {
            attributeMap: new Map<string, Map<string, string>>(),
            updateAttribute: (id: string, value: unknown) => {
                const controller = node as AttributeControlledNode;
                const map = controller.attributeMap.get(attribute);
                if (!map) return;
                map.set(id, `${value}`);
                setAttributeValueOnNode(node, map);
            },
        });
    }

    // We use a regex to split the attribute's value, and then
    // create a association between fragment id and attribute
    // position. by creating another map that stores the attributes
    // in the correct order.
    const propRegex = /<!--:(.{9}):-->/g;
    const controller = node as AttributeControlledNode;
    const values = node
        .getAttribute(attribute)
        ?.split(propRegex)
        .filter((v) => !!v);
    controller.attributeMap.set(attribute, new Map(values?.map((v) => [v, v])));

    // Notify all respective fragments of the
    // hydration node. This will enable them to set
    // the values dynamically on the attribute.
    for (const fragment of fragments) {
        fragment.hydrateClient(node);
    }
};
