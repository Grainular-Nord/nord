/** @format */

export type DirectiveHandler<NodeType extends Text | Element = Element> = (element: NodeType, arg: any) => void;
