/** @format */

import { ElementDirective } from '../../types';
import { DirectiveHandler } from '../../types/directive-handler';

export const createElementDirective = (name: `@${string}`, directive: DirectiveHandler<Element>): ElementDirective => {
    return {
        name,
        directive,
    };
};
