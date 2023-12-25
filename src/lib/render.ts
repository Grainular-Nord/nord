/** @format */

import { Component } from '../types/component';
import { Error } from '../types/enums/error.enum';
import { NordInit } from '../types/nord-init';
import { context } from './components/component-ctx';
import { createNamespace } from './create-namespace';
import { directives } from './directives/directives';
import { registerDirective } from './directives/register-directive';

/**
 * Renders a component to the specified target element in the DOM.
 * This function is responsible for mounting a given component into the DOM.
 *
 * @param {Component} component - The component to be rendered. This should be a function
 *   returned by `createComponent`.
 * @param {NordInit} options - An object containing options for rendering the component.
 *   - `target`: The DOM element where the component should be rendered. This is mandatory.
 *   - `hydrate`: Optional property to provide initial state or properties for hydration.
 *   - `directives`: An optional array of custom directives to be added to the global namespace.
 *
 * @throws {TypeError} Throws an error if no component is provided or if the target is not found.
 *
 * @example
 * // Example of rendering a component to the DOM
 * import {createComponent, render} from "@nord/core"
 *
 * const app = createComponent({
 *  // ...component definition...
 * });
 * render(app, { target: document.querySelector('#app') });
 *
 * @example
 * // You can also pass the initial props for the app component into the
 * // render function by using the `hydrate` property
 * import {createComponent, render} from "@nord/core"
 *
 * const app = createComponent({
 *  template: (html, { count }) => html``
 * });
 *
 * const count = grain(0)
 * render(app, {
 *  target: document.querySelector('#app'),
 *  hydrate: { count }
 *  });
 */

export const render = (component: Component, options: NordInit) => {
    if (!component) {
        throw new TypeError(Error.NO_COMPONENT_PROVIDED);
    }

    const { target } = options;
    if (!target) {
        throw new TypeError(Error.TARGET_NOT_FOUND);
    }

    // Create the global namespace (If not already created)
    createNamespace(context<any>());

    // Add custom directives to the global namespace
    const { directives: customDirectives = [] } = options;
    [...directives, ...customDirectives].forEach((directive) => registerDirective(directive));

    target.append(...component(options.hydrate ?? {}));
};
