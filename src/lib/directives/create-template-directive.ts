/** @format */

import { DirectiveHandler } from '../../types/directive-handler';
import { TemplateDirective } from '../../types/template-directive';

export const createTemplateDirective = (name: `&${string}`, directive: DirectiveHandler<Text>): TemplateDirective => {
    return {
        name,
        directive,
    };
};
