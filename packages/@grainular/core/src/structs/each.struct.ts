import type { ComponentFragment } from '../component/component-fragment';
import type { Subscribable } from '../component/template-parser';
import { Symbols } from '../internals/symbols';

export const $each = <T>(itt: Array<T> | Subscribable<Array<T>>) => {
    const fragments = new Map<unknown, DocumentFragment | null>();

    const struct = (root: Comment) => {
        root.textContent += '$each:';
    };

    return {
        $withKey: (key: (pred: T) => string | number) => {
            return {
                $as: (run: (entry: T, index: number, arr: Array<T>) => ComponentFragment | string | null) => {
                    return Object.assign(struct, {
                        [Symbols.STRUCT]: true as const,
                    });
                },
            };
        },
    };
};
