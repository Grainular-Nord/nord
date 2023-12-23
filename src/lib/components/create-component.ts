/** @format */

import { ComponentInit } from '../../types/component-init';
import { ComponentProps } from '../../types/component-props';
import { LifecycleFunc } from '../../types/lifecycle-func';
import { TypedProps } from '../../types/typed-props';
import { emptyNodeList } from '../../utils/empty-node-list';
import { isFunction } from '../../utils/is-function';
import { øEvaluateComponentTemplate } from './evaluate-component-template';
import { registerComponent } from './register-component';

export const createComponent = <Props extends ComponentProps, S extends string | never = never>(
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
