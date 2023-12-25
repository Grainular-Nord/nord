/** @format */

/**
 * A subscriber function is used to handle updates to the value of a grain.
 * Whenever the grain's value changes and the change passes the comparison check,
 * each subscriber function subscribed to that grain is called with the new value.
 *
 * @template V - The type of value the subscriber function will receive.
 *
 * @param {V} value - The current value of the grain.
 * @returns {void} This function does not return anything. Its purpose is to
 * perform actions based on the received value, such as updating the UI or triggering side effects.
 *
 * @example
 * // Example of a subscriber function
 * const logSubscriber = value => console.log(`The new value is: ${value}`);
 * const count$ = grain(0);
 * count$.subscribe(logSubscriber); // Subscribes the logging function to the grain
 */
export type Subscriber<V> = (value: V) => void;
