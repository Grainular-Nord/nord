/** @format */

import { DirectiveHandler } from './directive-handler';

export type TemplateDirective = {
    name: `&${string}`;
    directive: DirectiveHandler<Text>;
};
