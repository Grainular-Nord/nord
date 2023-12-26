/** @format */

import { ComponentProps } from '../types';
import { Component } from '../types/component';
import { NordInit } from '../types/nord-init';
import { context } from './components/component-ctx';
import { createNamespace } from './create-namespace';
import { lifecycleManager } from './lifecycle-manager';

/**
 * Renders a component to the specified target element in the DOM.
 * This function is responsible for mounting a given component into the DOM.
 *
 * @param {Component} component - The component to be rendered. This should be a function
 *   returned by `createComponent`.
 * @param {NordInit} options - An object containing options for rendering the component.
 *   - `target`: The DOM element where the component should be rendered. This is mandatory.
 *   - `hydrate`: Optional property to provide initial state or properties for hydration.
 *  They are based on the props that the initial component requires
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

export const render = <Props extends ComponentProps = {}>(component: Component<Props>, options: NordInit<Props>) => {
    if (!component) {
        throw new Error('[Nørd:Render]: "options.target" is "undefined" or "null". Expected an instance of "Element".');
    }

    const { target } = options;
    if (!target) {
        throw new Error(
            '[Nørd:Render]: Component is "undefined" or "null". Pass a Nord Component to render it to the DOM".'
        );
    }

    // Create the global namespace (If not already created)
    createNamespace(context<any>());

    // Setup the lifecycle management
    lifecycleManager.observe(target);

    target.append(...component(options.hydrate ?? {}));
};
