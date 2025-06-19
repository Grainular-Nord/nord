import { nodeLifecycleObserver } from '../internals/node-lifecycle-observer';
import { Symbols } from '../internals/symbols';
import type { Struct } from './struct';

export const createStruct = (struct: (root: Comment) => void | (() => void)) => {
    return Object.assign(
        (root: Comment) => {
            const cleanup = struct(root);

            if (cleanup) {
                nodeLifecycleObserver.trackUnmount(root, cleanup);
            }
        },
        {
            [Symbols.STRUCT]: Symbols.STRUCT,
        },
    ) satisfies Struct;
};
