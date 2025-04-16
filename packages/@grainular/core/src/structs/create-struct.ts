import { deletionObserver } from '../internals/deletion-observer';
import { Symbols } from '../internals/symbols';
import type { Struct } from './struct';

export const createStruct = (struct: (root: Comment) => void | (() => void)) => {
    return Object.assign(
        (root: Comment) => {
            const cleanup = struct(root);

            if (cleanup) {
                deletionObserver.track(root, cleanup);
            }
        },
        {
            [Symbols.STRUCT]: Symbols.STRUCT,
        },
    ) satisfies Struct;
};
