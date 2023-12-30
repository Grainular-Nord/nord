/** @format */

import { Context } from '../types';

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
