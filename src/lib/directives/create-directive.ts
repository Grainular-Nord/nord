/** @format */

import { Directive } from '../../types/directive';
import { DirectiveOptions } from '../../types/directive-options';

/**
 * Creates a custom directive for use in web components or similar frameworks.
 * This function facilitates the creation of directives that can be attached to DOM nodes,
 * allowing for custom behaviors or actions on those nodes. Directives created by this
 * function can be applied to Text or Element nodes.
 *
 * The `createDirective` function takes a handler function that is invoked with the DOM node
 * and the token string used during hydration. The handler defines the behavior or action to be performed on the node.
 *
 * @template NodeType - The type of DOM node the directive can be applied to, either Text or Element.
 *
 * @param {(node: NodeType, token: string) => void} handler - A function that executes
 * the directive's behavior, receiving a DOM node and the internal token string as parameters.
 * @param {DirectiveOptions} [options] - A optional object used to set a filter, if desired. If omitted,
 * no filtering takes place.
 *
 * @returns {Directive<NodeType>} A custom directive function, which can be attached to DOM nodes
 * in component templates to apply the defined behavior or action.
 */

export const createDirective = <NodeType extends Text | Element>(
    handler: (node: NodeType, token: string) => void,
    options?: DirectiveOptions
): Directive<NodeType> => {
    const directive = (node: NodeType, token: string) => {
        if (options) {
            const { nodeType } = options;
            if ((nodeType === 'Text' && node instanceof Element) || (nodeType === 'Element' && node instanceof Text)) {
                throw new TypeError(`[Nørd:Directive]: Node is of incorrect type. Expected type '${nodeType}'.`);
            }
        }

        handler(node, token);
    };

    Object.defineProperty(directive, 'isDirective', {
        value: true,
        writable: false,
        enumerable: false,
    });

    return directive as Directive<NodeType>;
};

const dir = createDirective((handler) => {}, { nodeType: 'Text' });
