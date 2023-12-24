/** @format */

import { ReadonlyGrain } from '../../types';
import { DirectiveHandler } from '../../types/directive-handler';
import { Error } from '../../types/enums/error.enum';
import { PropType } from '../../types/enums/prop-type.enum';
import { PropProcessor } from '../../types/prop-processor';
import { ToStringTypes } from '../../types/to-string-types';
import { getAttributeNameForValue } from '../../utils/get-attribute-name-for-value';
import { getStringValue } from '../../utils/get-string-value';
import { isElement } from '../../utils/is-element';
import { isText } from '../../utils/is-text';

const isolateNode = (node: Text, token: string) => {
    const tokenIndex = node.data.indexOf(token);
    const tokenNode = node.splitText(tokenIndex);
    tokenNode.splitText(token.length);
    return tokenNode;
};

const __øProcessors = new Map<PropType, PropProcessor>([
    // Primitive parser
    [
        PropType.PRIMITIVE,
        (node, token, value: ToStringTypes) => {
            // If the element is a text node, the text content is simply replaced without further processing,
            // after stringifying it
            if (isText(node)) {
                node.textContent = (node.textContent ?? token).replace(token, getStringValue(value));
            }

            /**
             * To replace a primitive value (Basically, anything goes, without special need to do anything)
             * the element is checked for its type. If it's inside a attribute's value or a attribute / attribute name,
             * replace accordingly
             */
            if (isElement(node)) {
                // Attribute name
                if (node.hasAttribute(token)) {
                    node.setAttribute(getStringValue(value), '');
                }

                const attrName = getAttributeNameForValue(node, token);
                if (attrName) {
                    node.setAttribute(attrName, getStringValue(value));
                }
            }
        },
    ],
    // Grain parser
    [
        PropType.GRAIN,
        (node, token, value: ReadonlyGrain<any>) => {
            /**
             * @todo -> Set up unsubscriber and set up a way to unsubscribe if the template is destroyed
             */

            // If the node is a text node, the text content is simply replaced without further processing,
            // after stringifying it
            if (isText(node)) {
                const grainNode = isolateNode(node, token);

                // set up the subscription of the grain
                value.subscribe((val) => {
                    grainNode.textContent = val;
                }, true);
            }

            // If the node is a Element, the value exists in an attribute as value.
            /** @todo -> In theory, we could check if a string value pair or object is passed in the grain
             * and create attributes accordingly. Not in the scope here
             */
            if (isElement(node)) {
                const attrName = getAttributeNameForValue(node, token);
                if (attrName) {
                    // If a attribute was found, that contains the grain value as token,
                    // set up the subscription
                    value.subscribe((val) => {
                        node.setAttribute(attrName, val);
                    }, true);
                }
            }
        },
    ],
    // Element directive Parser
    [
        PropType.ELEMENT_DIRECTIVE,
        (node, token, value: Record<string, any>) => {
            // Directives should only be added to elements as attributes.
            if (isText(node)) {
                throw new TypeError(Error.ELEMENT_DIRECTIVE_ON_TEXT, { cause: value });
            }

            if (isElement(node) && Object.keys(value).length === 1) {
                // the way directives work, we can select the attribute directly and remove it
                node.removeAttribute(token);
                // For each directive passed (should be 1), execute the directive from the global directive dict
                Object.entries(value).forEach(([name, handler]) => {
                    const directive = window.$$nord.directives.get(name) as DirectiveHandler<Element> | undefined;
                    if (!directive) throw new TypeError(Error.DIRECTIVE_NOT_FOUND, { cause: name });
                    directive(node, handler);
                });
            }
        },
    ],
    // Template directive parser
    [
        PropType.TEMPLATE_DIRECTIVE,
        (node, token, value: Record<string, any>) => {
            // Directives should only be added to elements as attributes.
            if (isText(node) && Object.keys(value).length === 1) {
                // Isolate the node
                const tokenNode = isolateNode(node, token);

                Object.entries(value).forEach(([name, handler]) => {
                    const directive = window.$$nord.directives.get(name) as DirectiveHandler<Text> | undefined;
                    if (!directive) throw new TypeError(Error.DIRECTIVE_NOT_FOUND, { cause: name });
                    directive(tokenNode, handler);
                });
            }

            // Template directives should ne be added to element attributes
            if (isElement(node)) {
                throw new TypeError(Error.TEMPLATE_DIRECTIVE_ON_TAG, { cause: value });
            }
        },
    ],
    // NodeList parser
    [
        PropType.NODE_LIST,
        (node, token, value: NodeList) => {
            if (isText(node)) {
                // Isolate the token in a single text node
                // This should enable putting NodeLists into the middle of text
                const tokenNode = isolateNode(node, token);
                tokenNode.replaceWith(...value);
            }

            // NodeLits should only be added to elements as Text.
            if (isElement(node)) {
                throw new TypeError(Error.NODE_LIST_IN_TAG, { cause: value });
            }
        },
    ],
]);

export const øGetProcessorByPropType = (type: PropType) => {
    let processor = __øProcessors.get(PropType.PRIMITIVE);
    if (__øProcessors.has(type)) {
        processor = __øProcessors.get(type);
    }

    if (processor) {
        return processor;
    }

    // This error will never be thrown, as a fallback processor will always be provided.
    throw new TypeError();
};
