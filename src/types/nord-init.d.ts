/** @format */

import { ComponentProps } from './component-props';
import { ElementDirective } from './element-directive';
import { TemplateDirective } from './template-directive';

/**
 * This type specifies the configuration options necessary for rendering a component to the DOM.
 *
 * @property {Element | null} target - The DOM element where the component should be rendered.
 *   This is a mandatory field. If null, an error will be thrown.
 * @property {ComponentProps} [hydrate] - Optional initial state or properties for hydrating the component.
 *   This is useful for server-side rendering scenarios or for initializing the component with a specific state.
 * @property {(ElementDirective | TemplateDirective)[]} [directives] - An optional array of custom directives
 *   that can be applied to elements or templates within the component. Directives provide a way to extend
 *   the behavior of elements or templates with custom logic.
 *
 * @example
 * // Example of using NordInit for rendering a component
 * render(app, // component
 *  {
 *   target: document.querySelector('#app'),
 *   hydrate: { someProp: 'someValue' },
 *   directives: [myCustomDirective]
 *  }
 * );
 *
 * // This configuration will render the component inside the '#app' element, hydrate it with
 * // initial properties, and apply any custom directives specified.
 */

export type NordInit = {
    target: Element | null;
    hydrate?: ComponentProps;
    directives?: (ElementDirective | TemplateDirective)[];
};
