/** @format */

import { Directive, ReadonlyGrain } from '../../types';
import { isElement } from '../../utils/is-element';
import { isGrain } from '../../utils/is-grain';
import { createDirective } from './create-directive';

const øEqualizeNodeLists = (root: Element, list: Node[]) => {
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

/**
 * Creates a template directive for rendering each item in an array or a reactive grain.
 * This function is particularly useful for dynamically rendering lists of elements where each
 * item in the array or grain is passed through a provided rendering function.
 *
 * @template T - The type of elements in the array or grain.
 *
 * @param {T[] | ReadonlyGrain<T[]>} value - The array or grain containing the list of items to render.
 *   If it's a grain, the directive will reactively update the rendered list based on its current value.
 * @param {(elem: T, index: number) => NodeList} run - A function that returns a NodeList for each item in the array.
 *   This function is called for each item in the array, receiving the item and its index as arguments.
 *
 * @returns {Directive} An object representing the created template directive. This directive can be used within
 *   component templates to render a list of items based on the provided array or grain.
 *
 * @example
 * // Example of creating a list rendering directive using ForEach
 *
 * // The returned directive can be used in component templates to render a list of items.
 * <ul>${forEach(todos, (todo, index) =>
 *   html`<li key="${index}">${todo}</li>`
 * );}</ul>
 *
 */

export const forEach = <T>(
    value: T[] | ReadonlyGrain<T[]>,
    run: (elem: T, index: number) => NodeList
): Directive<Text> => {
    return createDirective((node: Text) => {
        // Render the initial list
        const initialValue: T[] = isGrain(value) ? value() : value;
        let list = initialValue.flatMap((value, index) => [...run(value, index)]);
        if (list.length === 0) {
            list = [document.createTextNode('')];
        }

        node.replaceWith(...list);

        // If the value is a grain, subscriptions need to be setup to render the
        // elements accordingly
        if (isGrain(value)) {
            // Get the common ancestor for all nodes. If there is more then one ancestor, something went very wrong
            const [root, ...rest] = [...new Set(list.map((node) => node.parentElement))];
            if (rest.length !== 0 || !root) throw new Error('[Nørd:Directive]: Directive has multiple roots.');

            // Subscribe to the grain and equalize the nodeLists whenever the value changes
            value.subscribe((value: T[]) => {
                const list = value.flatMap((value, index) => [...run(value, index)]);
                øEqualizeNodeLists(root, list);
            });
            return;
        }
    });
};
