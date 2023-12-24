/** @format */

import { ReadonlyGrain } from '../../types';
import { isGrain } from '../../utils/is-grain';
import { øEqualizeNodeLists } from '../components/equalize-node-list';

export const ForEach = <T>(value: T[] | ReadonlyGrain<T[]>, run: (elem: T, index: number) => NodeList) => {
    const forEach = (node: Text) => {
        // Render the initial list
        const initialValue: T[] = isGrain(value) ? value() : value;
        const list = initialValue.flatMap((value, index) => [...run(value, index)]);
        node.replaceWith(...list);

        // If the value is a grain, subscriptions need to be setup to render the
        // elements accordingly
        if (isGrain(value)) {
            // Get the common ancestor for all nodes. If there is more then one ancestor, something went very wrong
            const [root, ...rest] = [...new Set(list.map((node) => node.parentElement))];
            if (rest.length !== 0 || !root) throw new TypeError(`Add Error`, { cause: 'NodeListComparison' });

            // Subscribe to the grain and equalize the nodeLists whenever the value changes
            value.subscribe((value: T[]) => {
                const list = value.flatMap((value, index) => [...run(value, index)]);
                øEqualizeNodeLists(root, list);
            });
            return;
        }
    };

    // Return the created template directive
    return { '&forEach': forEach };
};
