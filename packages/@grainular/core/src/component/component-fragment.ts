import { Symbols } from '../internals/symbols';

/**
 * The component fragment is the central piece of nord's architecture.
 */
export type ComponentFragment = {
    [Symbols.COMPONENT]: true;
    resolve: () => string;
};

export const createComponentFragment = (fragments: { resolve: () => string }[]): ComponentFragment => {
    return {
        [Symbols.COMPONENT]: true,
        resolve: () => fragments.map((fragment) => fragment.resolve()).join(''),
    };
};

export const isComponent = (value: unknown): value is ComponentFragment => {
    return value !== null && typeof value === 'object' && Symbols.COMPONENT in value;
};
