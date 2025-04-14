import { deletionObserver } from '../internals/deletion-observer';
import { Symbols } from '../internals/symbols';
import type { Directive } from './directive';

export const createDirective = (handler: (node: HTMLElement) => void | (() => void)): Directive => {
    return Object.assign(
        (node: HTMLElement) => {
            // we run the provided handler and check
            // if it returned a clean up function.
            const cleanup = handler(node);

            // If it has one, we add it to the observed
            // nodes and run the cleanup when the node
            // is disconnected.
            if (cleanup) {
                deletionObserver.track(node, cleanup);
            }
        },
        { [Symbols.DIRECTIVE]: Symbols.DIRECTIVE },
    ) satisfies Directive;
};
