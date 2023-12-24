/** @format */

import { Component } from '../types/component';
import { Directive } from '../types/directive';
import { Selector } from '../types/selector';

export const createNamespace = () => {
    if (!window.$$nord) {
        window.$$nord = {
            // Create a default namespace
            components: new Map<Selector<string>, Component>(),
            directives: new Map<`@${string}`, Directive>(),
        };
    }
};
