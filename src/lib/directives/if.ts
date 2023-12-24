/** @format */

import { ReadonlyGrain } from '../../types';
import { Error } from '../../types/enums/error.enum';
import { isGrain } from '../../utils/is-grain';
import { øEqualizeNodeLists } from '../components/equalize-node-list';

export const If = <T>(value: T | ReadonlyGrain<T>, run: (value: T) => NodeList) => {
    // Return the created template directive
    const ifFunc = (node: Text) => {
        const initialValue: T = isGrain(value) ? value() : value;
        const template = [...run(initialValue)];
        node.replaceWith(...template);

        if (isGrain(value)) {
            // Get the common ancestor for all nodes. If there is more then one ancestor, something went very wrong
            const [root, ...rest] = [...new Set(template.map((node) => node.parentElement))];
            console.log({ root });
            if (rest.length !== 0 || !root) throw new TypeError(Error.MULTIPLE_ROOTS, { cause: 'NodeListComparison' });

            // Subscribe to the grain and equalize the nodeLists whenever the value changes
            value.subscribe((value: T) => {
                const template = [...run(value)];
                øEqualizeNodeLists(root, template);
            });
            return;
        }
    };

    return { '&if': ifFunc };
};
