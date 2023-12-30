/** @format */

import { Context } from '../types';

/**
 * Creates a context object with initial values.
 *
 * A context object allows you to store and manage shared state within your Nørd application.
 *
 * @template Ctx - The type of the context object, which is a record of keys and their associated values.
 *
 * @param {Ctx} initial - An object containing the initial values to populate the context.
 *
 * @returns {Context<Ctx>} A context object with methods for setting, getting, and checking the existence of values.
 *
 * @example
 * // Creating a context with initial values
 * const appContext = createContext({
 *   theme: 'light',
 *   user: null,
 * });
 *
 * // Setting a value in the context
 * appContext.set('theme', 'dark');
 *
 * // Getting a value from the context
 * const currentTheme = appContext.get('theme'); // Returns 'dark'
 *
 * // Checking if a value exists in the context
 * const hasUser = appContext.has('user'); // Returns false
 */

export const createContext = <Ctx extends Record<PropertyKey, unknown>>(initial: Ctx): Context<Ctx> => {
    const _ctx = new Map<PropertyKey, any>([...Object.entries(initial)]);

    const set = <Key extends keyof Ctx>(key: Key, value: Ctx[Key]) => {
        _ctx.set(key, value);
    };

    const get = <Key extends keyof Ctx>(key: Key): Ctx[Key] => {
        return _ctx.get(key);
    };

    const has = (key: string): boolean => {
        return _ctx.has(key);
    };

    return { set, get, has };
};
