/** @format */

/**
 * Type definition for a lifecycle hook function in the framework.
 * This type represents the structure of functions used to define lifecycle actions for components.
 *
 * @param {() => void} action - A function that encapsulates the lifecycle action to be performed.
 *   This function does not take any parameters and does not return any value. It is intended to
 *   encapsulate side effects or setup and teardown logic that is tied to a component's lifecycle.
 *
 * @returns {void} This type of function does not return any value. Its purpose is to register
 *   the provided action as part of a component's lifecycle process, such as mounting or unmounting.
 *
 * @example
 * // Example of using a LifecycleFunc in a component
 * const MyComponent: Component<MyComponentProps> = ({$onMount, $onDestroy}) => {
 *   $onMount(() => {
 *     console.log("Component is mounted!");
 *     // Setup logic here
 *   });
 *
 *   $onDestroy(() => {
 *     console.log("Component is being destroyed!");
 *     // Teardown logic here
 *   });
 *
 *   // Component rendering logic...
 * };
 *
 * // These lifecycle hooks allow for executing specific actions when the component mounts or unmounts.
 */

export type LifecycleFunc = (action: () => void) => void;
