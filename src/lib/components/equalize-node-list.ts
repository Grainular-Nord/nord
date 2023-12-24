/** @format */

import { isElement } from '../../utils/is-element';

export const øEqualizeNodeLists = (root: Element, list: Node[]) => {
    // Normalize the root node
    root.normalize();

    // for each node, check if there is a corresponding entry in the new list
    [...root.children].forEach((node, index) => {
        let equalNode;
        // Check if comparison should be done by key
        // If the current element has a key, we try to find the list element with the same key
        const nodeKey = node.getAttribute('key');
        if (nodeKey) {
            equalNode = list.find((node) => node instanceof Element && node.getAttribute('key') === nodeKey);
        } else {
            // If no keys are provided, elements are checked and replaced by index;
            equalNode = list[index];
        }

        // If the list is to short, remove the keys at index
        if (!equalNode) {
            root.removeChild(node);
            return;
        }

        if (isElement(equalNode)) {
            // If the keys are not equal, replace them
            if (equalNode.innerHTML !== node.innerHTML) {
                root.replaceChild(equalNode, node);
                return;
            }
        }
    });

    // If the new list is longer then the current child list, add elements that are after the index
    if (list.length > root.childElementCount) {
        root.append(...list.slice(root.childElementCount));
    }
};
