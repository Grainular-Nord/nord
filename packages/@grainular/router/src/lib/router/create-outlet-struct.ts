import { $render } from '@grainular/nord';
import type { Silo } from '@grainular/silo';
import type { RouterState } from '../../types/router-state';

export const createOutletStruct = (state: Silo<RouterState>) => {
    return $render(state.select((s) => s.fragment));
};
