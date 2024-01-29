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
            const marker = document.createComment(`[When]`);
            node.replaceWith(marker);
            const root = () => marker.parentElement;

            let currentNodes: Node[] = [];

            const replaceNodes = (root: HTMLElement | null, nodes: Node[]) => {
                currentNodes.forEach((node) => root?.removeChild(node));
                nodes.forEach((node) => root?.insertBefore(node, marker.nextElementSibling));
                currentNodes = [...nodes];
            };

            // If the passed condition argument is a grain, evaluate the template reactively and append the nodes accordingly

            if (isGrain(condition)) {
                let lastEvaluatedResult: boolean | null = null;

                condition.subscribe((value) => {
                    const evaluated = evaluateCondition(value);
                    // Check if the result match, if yes, abort
                    if (lastEvaluatedResult !== null && lastEvaluatedResult === evaluated) {
                        lastEvaluatedResult = evaluated;
                        return;
                    }

                    // Replace the current nodes with the new nodes and vice versa.
                    replaceNodes(root(), nodes.get(evaluated)!);

                    // Set the current values as new old values
                    lastEvaluatedResult = evaluated;
                });
            }

            // If the condition is not a grain, the template is evaluated once
            if (!isGrain(condition)) {
                const result = evaluateCondition(condition);
                replaceNodes(root(), nodes.get(result)!);
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
