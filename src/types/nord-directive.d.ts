/** @format */

import { DirectiveHandler } from './directive-handler';

export type NørdDirective =
    | Record<`@${string}`, DirectiveHandler<Element>>
    | Record<`&${string}`, DirectiveHandler<Text>>;
