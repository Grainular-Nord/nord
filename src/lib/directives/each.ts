/** @format */

import { Directive, ReadonlyGrain } from '../../types';
import { isElement } from '../../utils/is-element';
import { isGrain } from '../../utils/is-grain';
import { createDirective } from './create-directive';

export type EachDirective<T> = {
    as: (
        runner: (value: T, index: number, arr: T[]) => NodeList
    ) => Directive<Text> & { else: (nodes: NodeList) => Directive<Text> };
};

const øEqualizeNodeLists = (root: Element, list: Node[]) => {
    console.log({ root, list });
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
            if (equalNode.outerHTML !== node.outerHTML) {
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
 * @returns {EachDirective<T>} An object representing the created template directive. This directive can be used within
 *   component templates to render a list of items based on the provided array or grain.
 *
 * @example
 * // Example of creating a list rendering directive using Each
 * ```ts
 *  const entries = grain(['A', 'B', 'C']);
 *  return html`<div>
 *      ${each(entries)
 *         .as((entry) => html`<div>${entry}</div>`)
 *         .else(html`<div>No entries!</div>`)}
 *      </div>`
 * ```
 */

export const each = <T>(value: ReadonlyGrain<T[]> | T[]): EachDirective<T> => {
    let elseNodes: Node[] = [document.createComment(`[Empty Else]`)];
    let runner: ((value: T, index: number, arr: T[]) => NodeList) | null = null;

    const getNodesFromValue = (value: T[]) => {
        return value.flatMap((v, i, a) => [...runner!(v, i, a)]);
    };

    // Create the primary directive that is responsible for replacing the nodes
    // once the data updates
    const setContentDirective = createDirective<Text>(
        (node) => {
            // If no runner exists, abort;
            if (!runner) {
                return;
            }

            // process the initial replacement
            const initialValue: T[] = isGrain(value) ? value() : value;
            let list = getNodesFromValue(initialValue);

            // If the list is empty, show the fallback nodes instead.
            if (list.length === 0) {
                list = elseNodes;
            }

            // Append the nodes
            node.replaceWith(...list);

            // If the value is reactive, connect the nodes and the list to ensure
            // Parity every time the value updates.
            if (isGrain(value)) {
                let current = list;
                let [root, ...rest] = [...new Set(current.map((el) => el.parentElement))];
                if (rest.length !== 0 || !root) throw new Error('[Nørd:Directive]: Directive has multiple roots.');

                // Subscribe to the grain
                value.subscribe((value) => {
                    const list = getNodesFromValue(value);
                    øEqualizeNodeLists(root!, list);
                });
            }
        },
        { nodeType: 'Text' }
    );

    // Add the `else` property to the directive to set the fallback nodes
    Object.defineProperty(setContentDirective, 'else', {
        value: (nodes: NodeList) => {
            elseNodes = [...nodes];
            return setContentDirective;
        },
    });

    return {
        as: (run: (value: T, index: number, arr: T[]) => NodeList) => {
            runner = run;
            return setContentDirective as Directive<Text> & { else: (nodes: NodeList) => Directive<Text> };
        },
    };
};
