import type { ComponentFragment } from '@grainular/nord';
import type { Params } from './params';
import type { Route } from './route';

export type RouterState = {
    path: string;
    route: Route | null;
    params: Params;
    query: Params;
    fragment: ComponentFragment;
    updateState: (newState: Omit<RouterState, 'updateState'>) => void;
};
