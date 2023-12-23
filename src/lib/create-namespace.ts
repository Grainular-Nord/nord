/** @format */

import { Component } from '../types/component';
import { Selector } from '../types/selector';

export const createNamespace = () => {
    if (!window.$$nord) {
        window.$$nord = {
            // Create a default namespace
            components: new Map<Selector<string>, Component>(),
        };
    }
};
