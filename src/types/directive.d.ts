/** @format */

import { DirectiveHandler } from './directive-handler';

export type Directive = {
    name: `@${string}`;
    directive: DirectiveHandler<Element>;
};
