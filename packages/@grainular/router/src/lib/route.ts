import type { ComponentFragment } from '@grainular/nord';
import type { NavigationHook } from './hooks/hooks';
import type { Transition } from './transitions/transition';

export type Route = {
    path: string;
    component: () =>
        | Promise<() => ComponentFragment>
        | Promise<{ default: () => ComponentFragment }>
        | ComponentFragment;
    use?: NavigationHook[];
    transition?: Transition | Transition[];
};
