/** @format */

import { Directive } from '../../types';
import { createNamespace } from '../create-namespace';

export const registerDirective = ({ name, directive }: Directive) => {
    if (!window.$$nord) createNamespace();

    const registry = window.$$nord.directives;
    const existing = registry.has(name);
    if (existing) {
        // new error
    }

    registry.set(name, directive);
};
