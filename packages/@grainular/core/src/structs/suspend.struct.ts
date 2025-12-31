import type { ComponentFragment } from '../component/component-fragment';
import { $await } from './await.struct';

export const $suspend = (
    component: () => Promise<ComponentFragment> | ComponentFragment,
    { pending, error }: { pending: () => ComponentFragment; error: (err: Error | string | null) => ComponentFragment },
) => {
    return $await(component())
        .$then((fragment) => fragment)
        .$catch(error)
        .$pending(pending);
};
