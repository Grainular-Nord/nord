/** @format */

import { Directive, ReadonlyGrain } from '../../types';
import { isGrain } from '../../utils/is-grain';
import { createDirective } from './create-directive';

export type WhenDirective = {
    then: (thenNodes: NodeList) => Directive<Text> & { else(elseNodes: NodeList): Directive<Text> };
};

/**
 * Creates a template directive that conditionally renders content based on the provided value or grain.
 * This function allows for dynamic rendering of parts of a template based on the state of a value or reactive grain.
 *
 * @template T - The type of the value or grain being evaluated.
 *
 * @param {T | ReadonlyGrain<T>} condition - The value or grain to evaluate. If it's a grain, the directive
 *   will reactively update the content based on its current value.
 * @param {(value: T) => boolean} [evaluate] - A function that evaluates the condition and returns a boolean.
 *   If not provided, the condition will be considered truthy if it's not null or undefined.
 *
 * @returns {WhenDirective} An object representing the created template directive. This directive can be used within
 *   component templates to conditionally render content based on the provided value or grain.
 *
 * @example
 * // Example of creating a conditional rendering directive using When
 *
 *  const condition = grain(false);
 *
 *  return html`<div>
 *      ${when(condition)
 *          .then(html`<div>Yes!</div>`)
 *          .else(html`<div>Nope!</div>`)}
 *  </div>`;
 */

export const when = <T>(condition: ReadonlyGrain<T> | T, evaluate?: (value: T) => boolean): WhenDirective => {
    const nodes = new Map<boolean, Node[]>([
        [true, [document.createComment(`[Empty Then]`)]],
        [false, [document.createComment(`[Empty Else]`)]],
    ]);

    const evaluateCondition = (value: T) => {
        return evaluate ? evaluate(value) : !!value;
    };

    const setContentDirective = createDirective<Text>(
        (node) => {
            // Evaluate the passed condition for the first time. The evaluate method is used when passed,
            // else the value / grain value is used to determine the true of false condition.

            const _initialConditionValue = isGrain(condition) ? condition() : condition;
            const _initialResult = evaluateCondition(_initialConditionValue);

            const nodesToReplace = nodes.get(_initialResult)!;
            node.replaceWith(...nodesToReplace);

            // Setup the primary subscription tracking the value, if the passed condition is a grain
            if (isGrain(condition)) {
                let current = nodesToReplace;
                let lastEvaluatedResult: boolean | null = null;
                const [root] = [...new Set(current.map((el) => el.parentElement))];
                condition.subscribe((value) => {
                    const evaluated = evaluateCondition(value);
                    // Check if the result match, if yes, abort
                    if (lastEvaluatedResult !== null && lastEvaluatedResult === evaluated) {
                        lastEvaluatedResult = evaluated;
                        return;
                    }

                    // Replace the current nodes with the new nodes and vice versa.
                    const nodesToReplace = nodes.get(evaluated)!;
                    current.forEach((node) => node.parentElement?.removeChild(node));
                    root?.append(...nodesToReplace);

                    // Set the current values as new old values
                    current = nodesToReplace;
                    lastEvaluatedResult = evaluated;
                });
            }
        },
        { nodeType: 'Text' }
    );

    // Set the else directive
    Object.defineProperty(setContentDirective, 'else', {
        value: (elseNodes: NodeList) => {
            nodes.set(false, [...elseNodes]);
            return setContentDirective;
        },
        writable: false,
    });

    return {
        then: (thenNodes: NodeList) => {
            nodes.set(true, [...thenNodes]);
            return setContentDirective as Directive<Text> & { else: (elseNodes: NodeList) => Directive<Text> };
        },
    };
};
