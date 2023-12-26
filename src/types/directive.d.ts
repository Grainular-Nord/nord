/** @format */

/**
 * Represents a directive function that can be applied to a DOM node.
 *
 * @template NodeType - The type of DOM node the directive can be applied to (Text or Element).
 *
 * @param {NodeType} node - The DOM node to which the directive is applied.
 *
 * @returns {void}
 */

export type Directive<NodeType extends Text | Element> = {
    (node: NodeType): void;
    readonly isDirective: true;
};
