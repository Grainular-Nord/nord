/** @format */

import { ComponentProps } from './component-props';
import { LifecycleFunc } from './lifecycle-func';

/**
 * TypedProps extends the base component properties with additional framework-specific properties,
 * including lifecycle hooks and children elements.
 *
 * @template P - The base type for the component's properties, extending from ComponentProps.
 * @template Ctx - The application ctx the application has access to.
 *
 * This type augments the base properties with the following additional properties:
 * - `$onMount`: A LifecycleFunc for registering an action to be performed when the component mounts.
 * - `$onDestroy`: A LifecycleFunc for registering an action to be performed when the component is destroyed.
 * - `$children`: A NodeList representing any children elements passed to the component.
 *
 * TypedProps are typically used within the context of a component's function to access both
 * the standard props and these additional framework-specific properties.
 *
 * @example
 * // Example of a component using TypedProps
 * const MyComponent: Component<MyComponentProps> = (props: TypedProps<MyComponentProps>) => {
 *   props.$onMount(() => {
 *     console.log("Component mounted!");
 *     // Additional mount logic
 *   });
 *
 *   props.$onDestroy(() => {
 *     console.log("Component will be destroyed!");
 *     // Cleanup logic
 *   });
 *
 *   // Rendering logic using props and props.$children
 * };
 *
 * // This approach provides a structured way to access and utilize both custom props and
 * // framework-specific properties within a component.
 */

export type TypedProps<P extends ComponentProps = {}> = P & {
    /**
     * A function to be executed when the component is mounted.
     *
     * @type {LifecycleFunc}
     */
    $onMount: LifecycleFunc;
    /**
     * A function to be executed when the component is unmounted.
     *
     * @type {LifecycleFunc}
     */
    $onDestroy: LifecycleFunc;
    /**
     * A NodeList representing the children of the component.
     *
     * @type {NodeList}
     */
    $children: NodeList;
};
