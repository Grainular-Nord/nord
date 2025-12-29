import { lifecycleObserver } from '../application/lifecycle-observer';
import { createDirective } from './create-directive';

/**
 * Runs the specified callback when the node mounts
 * When the callback returns a function, the function
 * will be used during cleanup
 * @param run
 */
export const mounted = (run: (element: Element) => void | (() => void)) => {
    return createDirective((node: Element) => {
        lifecycleObserver.trackMount(node, () => run(node));
    });
};
