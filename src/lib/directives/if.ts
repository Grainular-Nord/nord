/** @format */

import { ReadonlyGrain } from '../../types';
import { Error } from '../../types/enums/error.enum';
import { isGrain } from '../../utils/is-grain';
import { øEqualizeNodeLists } from '../components/equalize-node-list';

export const If = (value: boolean | ReadonlyGrain<boolean>, run: (value: boolean) => NodeList) => {
    // Return the created template directive
    const ifFunc = (node: Text) => {
        const initialValue: boolean = isGrain(value) ? value() : value;
        const template = [...run(initialValue)];
        node.replaceWith(...template);

        if (isGrain(value)) {
            // Get the common ancestor for all nodes. If there is more then one ancestor, something went very wrong
            const [root, ...rest] = [...new Set(template.map((node) => node.parentElement))];
            if (rest.length !== 0 || !root) throw new TypeError(Error.MULTIPLE_ROOTS, { cause: 'NodeListComparison' });

            // Subscribe to the grain and equalize the nodeLists whenever the value changes
            value.subscribe((value: boolean) => {
                const template = [...run(value)];
                øEqualizeNodeLists(root, template);
            });
            return;
        }
    };

    return { '&if': ifFunc };
};
