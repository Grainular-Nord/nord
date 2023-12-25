/** @format */

/**
 * A DirectiveHandler is a function that defines the behavior or transformation applied by a directive
 * to a DOM node. This type is generic and can be specialized for either Text or Element nodes.
 *
 * @template NodeType - The type of DOM node the directive is applied to. This can be either Text or Element.
 *
 * @param {NodeType} element - The DOM node (Text or Element) the directive is applied to.
 * @param {any} arg - An argument or set of arguments that provide additional information or context to the directive.
 *   This can be used to pass data, configuration, or other necessary information to the directive handler.
 *
 * @returns {void} Directive handlers do not return a value. Their purpose is to perform actions or apply
 *   transformations to the provided DOM node.
 *
 * @example
 * // Example of a DirectiveHandler for an Element
 * const highlightHandler: DirectiveHandler<Element> = (element, color) => {
 *   element.style.backgroundColor = color;
 * };
 *
 * // This handler could be used in a directive to apply background color to an element.
 *
 * @example
 * // Example of a DirectiveHandler for a Text node
 * const formatTextHandler: DirectiveHandler<Text> = (textNode, format) => {
 *   // Apply formatting to the textNode based on the format argument
 * };
 *
 * // This handler could be used in a directive to format Text nodes in a specific way.
 */

export type DirectiveHandler<NodeType extends Text | Element = Element> = (element: NodeType, arg: any) => void;
