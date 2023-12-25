/** @format */

import { ComponentInit } from '../../types/component-init';
import { ComponentProps } from '../../types/component-props';
import { LifecycleFunc } from '../../types/lifecycle-func';
import { TypedProps } from '../../types/typed-props';
import { emptyNodeList } from '../../utils/empty-node-list';
import { isFunction } from '../../utils/is-function';
import { øEvaluateComponentTemplate } from './evaluate-component-template';
import { registerComponent } from './register-component';

/**
 * Creates a new component with specified lifecycle methods and a template.
 * This function enables defining reactive components with customizable behavior and structure,
 * based on the provided template and lifecycle hooks.
 *
 * @template Props - The type of properties that the component will accept. Must extend ComponentProps.
 * @template S - A string type for the component's selector, if applicable.
 *
 * @param {ComponentInit<Props, S>} init - An object containing the component's initialization parameters.
 *   - `template`: A function that defines the component's structure and behavior. It takes a parser function
 *     (HtmlParserFunc) and the component's properties as arguments. The parser function processes a tagged template
 *     literal, allowing the integration of reactive grains and directives within the template, and returns a NodeList
 *     representing the DOM structure of the component.
 *   - `selector`: (Optional) A CSS selector used for registering the component in a global namespace. The selector,
 *     if provided, must be a capitalized string. It serves as a custom tag name for the component, enabling
 *     the usage of the component as a Component in the framework.
 *
 * @returns {Component<Props>} A function that represents the component. It accepts the component's props and an
 * optional NodeList of children, returning a NodeList that represents the rendered component.
 *
 * @example
 * // Example of creating and rendering a simple counter component
 * const app = createComponent({
 *     template: (html) => {
 *         const count = grain(0);
 *         return html`
 *                 <button ${{ '@click': () => count.update((c) => c + 1) }}>
 *                     Count is: ${count}, Doubled is: ${doubled}
 *                 </button>
 *         `;
 *     },
 * });
 */

export const createComponent = <Props extends ComponentProps = {}, S extends string | never = never>(
    init: ComponentInit<Props, S>
) => {
    // Set up lifecycle methods
    let onMount: null | (() => void) = null;
    let onDestroy: null | (() => void) = null;
    const $onMount: LifecycleFunc = (func: () => void) => {
        onMount = func;
    };
    const $onDestroy: LifecycleFunc = (func: () => void) => {
        onDestroy = func;
    };

    // Create the component function
    const component = (props: Props, children?: NodeList) => {
        const _props: TypedProps<Props> = { ...props, $onMount, $onDestroy, $children: children ?? emptyNodeList() };
        const evaluatedTemplate = init.template(øEvaluateComponentTemplate, _props);

        // If after the template evaluation a onMount function is set and no longer null, execute the onMount function.
        // This happens basically after the first render, before the component is added to the component tree.
        if (onMount && isFunction(onMount)) onMount();

        /** @todo -> onDestroy should be created using a mutation observer */

        return evaluatedTemplate;
    };

    // If a selector is passed, register the component in the component registry
    const { selector } = init;
    if (selector) registerComponent(selector, component);

    return component;
};
