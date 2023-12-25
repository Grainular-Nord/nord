/** @format */

/**
 * Represents a context object that stores and retrieves values of specific keys.
 *
 * @template Ctx - The type of the context object, defining the keys and their value types.
 *
 * @param {Key} key - The key to set a value for in the context object.
 * @param {Value} value - The value to set for the specified key in the context object.
 *
 * @returns {void}
 *
 * @throws {TypeError} Throws a TypeError if the key is not found in the context object.
 *
 * @example
 * // Example of setting a value in a context object
 * const context = createContext({ name: 'John', age: 30 });
 * context.set('name', 'Alice');
 *
 * @param {Key} key - The key to retrieve a value for from the context object.
 *
 * @returns {Value} The value associated with the specified key in the context object.
 *
 * @throws {TypeError} Throws a TypeError if the key is not found in the context object.
 *
 * @example
 * // Example of getting a value from a context object
 * const context = createContext({ name: 'John', age: 30 });
 * const name = context.get('name'); // Returns 'John'
 *
 * @param {string} key - The key to check for existence in the context object.
 *
 * @returns {boolean} `true` if the key exists in the context object, `false` otherwise.
 */

export type Context<Ctx extends Record<PropertyKey, unknown>> = {
    set: <Key extends keyof Ctx>(key: Key, value: Ctx[Key]) => void;
    get: <Key extends keyof Ctx>(key: Key) => Ctx[Key];
    has: (key: string) => boolean;
};
