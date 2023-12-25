/** @format */

import { Component } from '../types/component';
import { DirectiveHandler } from '../types/directive-handler';
import { ElementDirective } from '../types/element-directive';
import { Selector } from '../types/selector';

export const createNamespace = () => {
    if (!window.$$nord) {
        window.$$nord = {
            // Create a default namespace
            components: new Map<Selector<string>, Component>(),
            directives: new Map<string, DirectiveHandler<Text> | DirectiveHandler<Element>>(),
        };
    }
};
