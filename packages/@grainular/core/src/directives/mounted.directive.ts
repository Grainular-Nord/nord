import { nodeLifecycleObserver } from '../internals/node-lifecycle-observer';
import { createDirective } from './create-directive';

export const mounted = (run: (element: Element) => void | (() => void)) => {
    return createDirective((node: Element) => {
        nodeLifecycleObserver.trackMount(node, () => run(node));
    });
};
