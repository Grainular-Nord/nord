/** @format */

import { Component } from '../types/component';
import { Error } from '../types/enums/error.enum';
import { NordInit } from '../types/nord-init';
import { createNamespace } from './create-namespace';
import { directives } from './directives/directives';
import { registerDirective } from './directives/register-directive';

export const render = (component: Component, options: NordInit) => {
    if (!component) {
        throw new TypeError(Error.NO_COMPONENT_PROVIDED);
    }

    const { target } = options;
    if (!target) {
        throw new TypeError(Error.TARGET_NOT_FOUND);
    }

    // Create the global namespace (If not already created)
    createNamespace();

    // Add custom directives to the global namespace
    const { directives: customDirectives = [] } = options;
    [...directives, ...customDirectives].forEach((directive) => registerDirective(directive));

    target.append(...component(options.hydrate ?? {}));
};
