/** @format */

import { Context } from '../types/context';

export const createNamespace = (context: Context<any>) => {
    if (!window.$$nord) {
        window.$$nord = {
            // Create a default namespace
            context: context,
        };
    }
};
