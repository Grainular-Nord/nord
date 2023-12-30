/** @format */

import { ComponentTemplate } from '../../types/component-template';
import { ComponentProps } from '../../types/component-props';
import { LifecycleFunc } from '../../types/lifecycle-func';
import { TypedProps } from '../../types/typed-props';
import { emptyNodeList } from '../../utils/empty-node-list';
import { isFunction } from '../../utils/is-function';
import { øCreateIdentifier } from './create-identifier';
import { øEvaluateComponentTemplate } from './evaluate-component-template';
import { Component } from '../../types';
import { lifecycleManager } from '../lifecycle-manager';
import { CssParserFunc } from '../../types/css-parser-func';
import { øEvaluateComponentStyle } from './evaluate-component-style';

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
 * import {createComponent, grain, on} from "@grainular/nord"
 *
 * const app = createComponent((html) => {
 *     const count = grain(0);
 *     return html`
 *         <button ${on('click', () => count.update((c) => c + 1)}>
 *             Count is: ${count}
 *         </button>
 *     `;
 * });
 */

export const createComponent = <Props extends ComponentProps = {}>(
    template: ComponentTemplate<Props>
): Component<Props> => {
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
        const _props: TypedProps<Props> = { ...props, $onMount, $onDestroy, $children };
        const evaluatedTemplate = template(øEvaluateComponentTemplate(componentId), _props);

        // If after the template evaluation a onMount function is set and no longer null, execute the onMount function.
        if (onMount && isFunction(onMount)) {
            lifecycleManager.trackOnCreate({ nodesToObserve: [...evaluatedTemplate], handler: onMount });
        }

        // If onDestroy was set, the function is added to the manager together with the nodes
        if (onDestroy && isFunction(onDestroy)) {
            lifecycleManager.trackOnDestroy({ nodesToObserve: [...evaluatedTemplate], handler: onDestroy });
        }

        return evaluatedTemplate;
    };

    component.setStyle = (action: (parser: CssParserFunc) => void) => {
        action(øEvaluateComponentStyle(componentId));
    };

    // Add id to the prototype of the component
    Object.defineProperty(component, 'id', {
        value: componentId,
        writable: false,
        enumerable: false,
    });

    return component as Component<Props>;
};
