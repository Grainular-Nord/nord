import type { ComponentFragment, Fragment } from '@grainular/nord';

const IS_COMPONENT = Symbol.for('nord.component');

export const isComponent = (value: unknown): value is ComponentFragment => {
    return (
        typeof value === 'object' &&
        value !== null &&
        IS_COMPONENT in value &&
        (value as Fragment & { [IS_COMPONENT]?: boolean })[IS_COMPONENT] === true
    );
};
