/** @format */

import { Directive } from '../../types';
import { DirectiveHandler } from '../../types/directive-handler';

export const createElementDirective = (name: `@${string}`, directive: DirectiveHandler<Element>): Directive => {
    return {
        name,
        directive,
    };
};
