/** @format */

import { Context } from '../types/context';
import { DirectiveHandler } from '../types/directive-handler';

export const createNamespace = (context: Context<any>) => {
    if (!window.$$nord) {
        window.$$nord = {
            // Create a default namespace
            context: context,
            directives: new Map<string, DirectiveHandler<Text> | DirectiveHandler<Element>>(),
        };
    }
};
