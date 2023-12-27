/** @format */

import { Directive } from '../../types/directive';

export const createDirective = <NodeType extends Text | Element>(
    handler: (node: NodeType, token: string) => void
): Directive<NodeType> => {
    const directive = (node: NodeType, token: string) => {
        handler(node, token);
    };

    Object.defineProperty(directive, 'isDirective', {
        value: true,
        writable: false,
        enumerable: false,
    });

    return directive as Directive<NodeType>;
};
