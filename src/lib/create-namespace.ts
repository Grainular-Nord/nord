/** @format */

import { DirectiveHandler } from '../types/directive-handler';

export const createNamespace = () => {
    if (!window.$$nord) {
        window.$$nord = {
            // Create a default namespace
            context: new Map(),
            directives: new Map<string, DirectiveHandler<Text> | DirectiveHandler<Element>>(),
        };
    }
};
