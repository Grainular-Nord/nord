/** @format */

import { Directive } from '../../types';
import { DirectiveHandler } from '../../types/directive-handler';

export const createDirective = (name: `@${string}`, directive: DirectiveHandler): Directive => {
    return {
        name,
        directive,
    };
};
