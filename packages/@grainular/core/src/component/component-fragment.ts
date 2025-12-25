import { Symbols } from '../internals/symbols';
import type { FragmentMap } from './template-parser';

/**
 * The component fragment is the central piece of nord's architecture.
 */
export type ComponentFragment = {
    [Symbols.COMPONENT]: typeof Symbols.COMPONENT;
    readonly fragments: FragmentMap;
    resolve: () => string;
};

export const createComponentFragment = (
    fragments: { resolve: () => string }[],
    map: FragmentMap,
): ComponentFragment => {
    return {
        [Symbols.COMPONENT]: Symbols.COMPONENT,
        fragments: map,
        resolve: () => fragments.map((fragment) => fragment.resolve()).join(''),
    };
};

export const isComponent = (value: unknown): value is ComponentFragment => {
    return value !== null && typeof value === 'object' && Symbols.COMPONENT in value;
};
