import type { StylableFragment } from '../../dist/types';
import type { ComponentFragment } from './component-fragment';

export type ComponentProps = Record<PropertyKey, unknown>;
export type PropsWithChildren<T extends ComponentProps = Record<PropertyKey, unknown>> = {
    children: string | ComponentFragment | StylableFragment | null;
} & T;

export type PureComponent<T extends ComponentProps | undefined = undefined> = T extends undefined
    ? () => ComponentFragment
    : (props: T) => ComponentFragment;
