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
    /**
     * Represents a directive function that can be applied to a DOM element within the framework.
     *
     * @callback Directive
     * @param {NodeType} node - The DOM node to which the directive is applied.
     * @returns {void} This function does not return a value.
     */
    (node: NodeType): void;

    /**
     * A flag indicating that a function is a directive.
     *
     * @type {true}
     * @readonly
     * @memberof Directive
     * @instance
     */
    readonly isDirective: true;
};
