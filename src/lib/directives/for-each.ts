/** @format */

import { Directive, ReadonlyGrain } from '../../types';
import { Error } from '../../types/enums/error.enum';
import { isGrain } from '../../utils/is-grain';
import { øEqualizeNodeLists } from '../components/equalize-node-list';
import { createDirective } from './create-directive';

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
 * // e.g., <ul>${ForEach(todos, (todo, index) =>
 *   html`<li key="${index}">${todo}</li>`
 * );}</ul>
 *
 */

export const ForEach = <T>(
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
            console.log({ list, root, rest });
            if (rest.length !== 0 || !root) throw new TypeError(Error.MULTIPLE_ROOTS, { cause: 'NodeListComparison' });

            // Subscribe to the grain and equalize the nodeLists whenever the value changes
            value.subscribe((value: T[]) => {
                const list = value.flatMap((value, index) => [...run(value, index)]);
                øEqualizeNodeLists(root, list);
            });
            return;
        }
    });
};
