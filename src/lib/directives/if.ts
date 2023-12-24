/** @format */

import { ReadonlyGrain } from '../../types';
import { Error } from '../../types/enums/error.enum';
import { isGrain } from '../../utils/is-grain';
import { øEqualizeNodeLists } from '../components/equalize-node-list';

export const If = <T>(value: T | ReadonlyGrain<T>, run: (value: T) => NodeList) => {
    // Return the created template directive
    const ifFunc = (node: Text) => {
        const initialValue: T = isGrain(value) ? value() : value;
        const [template] = [...run(initialValue)];
        node.replaceWith(...[template]);

        if (isGrain(value)) {
            let currentElement: Node | undefined = template;
            // Subscribe to the grain and equalize the nodeLists whenever the value changes
            value.subscribe((value: T) => {
                const [replace] = [...run(value)];
                currentElement?.parentElement?.replaceChild(replace, currentElement);
                currentElement = replace;
            });
        }
    };

    return { '&if': ifFunc };
};
