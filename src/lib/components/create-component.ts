/** @format */

import { ComponentTemplate } from '../../types/component-template';
import { ComponentProps } from '../../types/component-props';
import { LifecycleFunc } from '../../types/lifecycle-func';
import { TypedProps } from '../../types/typed-props';
import { emptyNodeList } from '../../utils/empty-node-list';
import { isFunction } from '../../utils/is-function';
import { øCreateIdentifier } from './create-identifier';
import { øEvaluateComponentTemplate } from './evaluate-component-template';

/**
 * Creates a new component with specified lifecycle methods and a template.
 * This function enables defining reactive components with customizable behavior and structure,
 * based on the provided template and lifecycle hooks.
 *
 * @template Props - The type of properties that the component will accept. Must extend ComponentProps.
 *
 * @param {ComponentTemplate<Props>} template - A function that defines the component's structure and behavior.
 * It takes a parser function (HtmlParserFunc) and the component's properties as arguments. The parser function
 * processes a tagged template literal, allowing the integration of reactive grains and directives within the template,
 * and returns a NodeList representing the DOM structure of the component.
 *
 * @returns {Component<Props>} A function that represents the component. It accepts the component's props and an
 * optional NodeList of children, returning a NodeList that represents the rendered component.
 *
 * @example
 * // Example of creating and rendering a simple counter component
 * const app = createComponent((html) => {
 *     const count = grain(0);
 *     return html`
 *         <button ${{ '@click': () => count.update((c) => c + 1) }}>
 *             Count is: ${count}, Doubled is: ${doubled}
 *         </button>
 *     `;
 * });
 */

export const createComponent = <Props extends ComponentProps = {}, Ctx extends Record<PropertyKey, unknown> = {}>(
    template: ComponentTemplate<Props, Ctx>
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

    const componentId = øCreateIdentifier();

    // Create the component function
    const component = (props: Props, children?: NodeList) => {
        const $children = children ?? emptyNodeList();
        const $ctx = window.$$nord.context;
        const _props: TypedProps<Props, Ctx> = { ...props, $onMount, $onDestroy, $children, $ctx };
        const evaluatedTemplate = template(øEvaluateComponentTemplate(componentId), _props);

        // If after the template evaluation a onMount function is set and no longer null, execute the onMount function.
        // This happens basically after the first render, before the component is added to the component tree.
        if (onMount && isFunction(onMount)) onMount();

        /** @todo -> onDestroy should be created using a mutation observer */

        return evaluatedTemplate;
    };

    // Add id to the prototype of the component
    Object.defineProperty(component, 'id', {
        value: componentId,
        writable: false,
        enumerable: false,
    });

    return component;
};
