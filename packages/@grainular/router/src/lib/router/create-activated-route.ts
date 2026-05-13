import { type Grain, derived } from '@grainular/grains';
import type { Silo } from '@grainular/silo';
import type { Params } from '../../types/params';
import type { RouterState } from '../../types/router-state';

export type ActivatedRoute = {
    path: Grain<string>;
    params: Grain<Params>;
    query: Grain<Params>;
};

export const createActivatedRoute = (state: Silo<RouterState>): ActivatedRoute => {
    return {
        path: derived(state, (routerState) => routerState.path),
        params: derived(state, (routerState) => routerState.params),
        query: derived(state, (routerState) => routerState.query),
    };
};
