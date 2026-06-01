import { createDirective } from './create-directive';

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
