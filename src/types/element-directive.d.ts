/** @format */

import { DirectiveHandler } from './directive-handler';

export type ElementDirective = {
    name: `@${string}`;
    directive: DirectiveHandler<Element>;
};
