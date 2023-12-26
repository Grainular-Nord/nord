/** @format */

import { Directive } from '../../types/directive';

export const createDirective = <NodeType extends Text | Element>(
    handler: (node: NodeType) => void
): Directive<NodeType> => {
    const directive = (node: NodeType) => {
        handler(node);
    };

    Object.defineProperty(directive, 'isDirective', {
        value: true,
        writable: false,
        enumerable: false,
    });

    return directive as Directive<NodeType>;
};
