import type { Fragment } from '../internals/fragment';

export const IS_COMPONENT: unique symbol = Symbol.for('nord.component');
export type ComponentFragment = Fragment & {
    [IS_COMPONENT]: true;
};

export type StylableFragment = ComponentFragment & {
    css: (str: TemplateStringsArray, ...fragments: (string | number | boolean)[]) => Omit<ComponentFragment, 'css'>;
};
