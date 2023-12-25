/** @format */

import { ElementDirective } from '../../types';
import { Error } from '../../types/enums/error.enum';
import { TemplateDirective } from '../../types/template-directive';
import { createNamespace } from '../create-namespace';

export const registerDirective = ({ name, directive }: ElementDirective | TemplateDirective) => {
    if (!window.$$nord) createNamespace();

    const registry = window.$$nord.directives;
    const existing = registry.has(name);
    if (existing) {
        throw new TypeError(Error.DIRECTIVE_EXISTS);
    }

    registry.set(name, directive);
};
