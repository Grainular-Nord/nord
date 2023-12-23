/** @format */

import { Component } from '../../types/component';
import { Error } from '../../types/enums/error.enum';
import { Selector } from '../../types/selector';
import { createNamespace } from '../create-namespace';

export const registerComponent = <S extends string>(selector: Selector<S>, component: Component) => {
    if (!window.$$nord) createNamespace();

    const registry = window.$$nord.components;
    const existing = registry.has(selector);
    if (existing) {
        throw new TypeError(Error.SELECTOR_USED, { cause: selector });
    }

    registry.set(selector, component);
};
