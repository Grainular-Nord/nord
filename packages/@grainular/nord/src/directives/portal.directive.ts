import { disconnectNodes } from '../application/lifecycle-observer';
import type { PureComponent } from '../component/component-types';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createDirective } from './create-directive';

export type Portal = {
    attach: (component: PureComponent) => () => void;
};

/**
 * Creates a portal that can render a component into a specific DOM element.
 *
 * Example:
 * ```ts
 * const myPortal = createPortal(document.body);
 * const cleanup = myPortal.attach(() => html`<div>I'm rendered in the body!</div>`);
 * // Call cleanup() to remove the nodes from the body
 * ```
 *
 * @param target - The DOM element to render the component into.
 * @returns An object with an `attach` method to mount a component and return a cleanup function.
 */
export const createPortal = (target: Element | undefined | null): Portal => {
    return {
        attach: (component: PureComponent) => {
            if (!target) throw new ReferenceError('[Nord] Portal target not defined');

            const nodes = hydrateFragment(component());
            target.append(...nodes);

            return () => {
                disconnectNodes(nodes);
            };
        },
    };
};

/**
 * Creates a directive that moves the element into a portal target.
 *
 * Example:
 * ```ts
 * const App = () => html`
 *   <div ${portal(document.body)}>I'm rendered in the body via directive!</div>
 * `;
 * ```
 *
 * @param target - The DOM element to move the node into.
 * @returns A directive fragment that can be attached to an element.
 */
export const portal = (target: Element | undefined | null) => {
    return createDirective((node) => {
        if (!target) throw new ReferenceError('[Nord] Portal target not defined');

        target.appendChild(node);

        return () => {
            target.removeChild(node);
        };
    });
};
