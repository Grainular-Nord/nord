/** @format */

/**
 * ComponentProps is a flexible type that represents the props that can be passed to a component.
 * It's structured as a record, allowing for any set of properties with various types.
 *
 * @type {Record<PropertyKey, unknown>} ComponentProps
 *
 * This type is intended to be used as a base for extending more specific props for individual components.
 * It uses `Record<PropertyKey, unknown>`, meaning it can have properties of any name with any type,
 * providing a flexible structure for component properties.
 *
 * @example
 * // Example of extending ComponentProps for a specific component
 * interface MyComponentProps extends ComponentProps {
 *   title: string;
 *   count: number;
 *   onIncrement: () => void;
 * }
 *
 * // This interface can now be used as the Props type for a component,
 * // ensuring that it receives 'title', 'count', and 'onIncrement' as props.
 */

export type ComponentProps = Record<PropertyKey, unknown>;
