/** @format */

import { ReadonlyGrain } from '../../types';
import { NørdDirective } from '../../types/nord-directive';
import { isGrain } from '../../utils/is-grain';

/**
 * Creates a template directive that conditionally renders content based on the provided value or grain.
 * This function allows for dynamic rendering of parts of a template based on the state of a value or reactive grain.
 *
 * @template T - The type of the value or grain being evaluated.
 *
 * @param {T | ReadonlyGrain<T>} value - The value or grain to evaluate. If it's a grain, the directive
 *   will reactively update the content based on its current value.
 * @param {(value: T) => NodeList} run - A function that returns a NodeList based on the value.
 *   This function defines the content to render when the condition (based on the value or grain) is met.
 *   The NodeList must always contain at least one **Element**.
 *
 * @returns {NørdDirective} An object representing the created template directive. This directive can be used within
 *   component templates to conditionally render content based on the provided value or grain.
 *
 * @example
 * // Example of creating a conditional rendering directive using If
 *
 * // The returned directive can be used in component templates to render content conditionally.
 * // e.g., <div ${If(isLoggedIn, (loggedIn) =>
 *   loggedIn ? html`<span>Logged in!</span>` : html`<span>Logged in!</span>`
 * );}></div>
 */

export const If = <T>(value: T | ReadonlyGrain<T>, run: (value: T) => NodeList): NørdDirective => {
    // Return the created template directive
    const ifFunc = (node: Text) => {
        const initialValue: T = isGrain(value) ? value() : value;
        const [template] = [...run(initialValue)];
        node.replaceWith(...[template]);

        if (isGrain(value)) {
            let currentElement: Node | undefined = template;
            // Subscribe to the grain and equalize the nodeLists whenever the value changes
            value.subscribe((value: T) => {
                const [replace] = [...run(value)];
                currentElement?.parentElement?.replaceChild(replace, currentElement);
                currentElement = replace;
            });
        }
    };

    return { '&if': ifFunc };
};
