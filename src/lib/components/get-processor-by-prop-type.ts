/** @format */

import { ReadonlyGrain } from '../../types';
import { Directive } from '../../types/directive';
import { PropType } from '../../types/enums/prop-type.enum';
import { PropProcessor } from '../../types/prop-processor';
import { ToStringTypes } from '../../types/to-string-types';
import { getAttributeNameForValue } from '../../utils/get-attribute-name-for-value';
import { getStringValue } from '../../utils/get-string-value';
import { isElement } from '../../utils/is-element';
import { isText } from '../../utils/is-text';

const øProcessors = new Map<PropType, PropProcessor>([
    // Primitive parser
    [
        PropType.PRIMITIVE,
        (node, token, value: ToStringTypes) => {
            // If the element is a text node, the text content is simply replaced without further processing,
            // after stringifying it
            if (isText(node) && node.textContent) {
                node.textContent = node.textContent.replace(token, getStringValue(value));
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

                if (node.hasAttribute(token)) {
                    node.removeAttribute(token);
                }
            }
        },
    ],
    // Grain parser
    [
        PropType.GRAIN,
        (node, token, value: ReadonlyGrain<any>) => {
            // If the node is a text node, the text content is simply replaced without further processing,
            // after stringifying it
            if (isText(node)) {
                // set up the subscription of the grain
                const unsubscribe = value.subscribe((val) => {
                    if (!node.isConnected) {
                        unsubscribe();
                    }

                    node.textContent = val;
                }, true);
            }

            /**
             * If the node is a Element, the value exists in an attribute as value.
             */
            if (isElement(node)) {
                const attrName = getAttributeNameForValue(node, token);
                if (attrName) {
                    // If a attribute was found, that contains the grain value as token,
                    // set up the subscription
                    const unsubscribe = value.subscribe((val) => {
                        if (!node.isConnected) {
                            unsubscribe();
                        }

                        node.setAttribute(attrName, val);
                    }, true);
                }
            }
        },
    ],
    // Directive parser
    [
        PropType.DIRECTIVE,
        (node, token, value: Directive<Text | Element>) => {
            // Directives are given full control over the node.
            value(node);

            if (node.isConnected && node instanceof Element) {
                if (node.hasAttribute(token)) {
                    node.removeAttribute(token);
                }
            }
        },
    ],
    // NodeList parser
    [
        PropType.NODE_LIST,
        (node, token, value: NodeList) => {
            if (isText(node)) {
                node.replaceWith(...value);
            }

            // NodeLits should only be added to elements as Text.
            if (isElement(node)) {
                throw new Error('[Nørd:Component]: Node List used inside a html tag.');
            }
        },
    ],
]);

export const øGetProcessorByPropType = (type: PropType) => {
    let processor = øProcessors.get(PropType.PRIMITIVE);
    if (øProcessors.has(type)) {
        processor = øProcessors.get(type);
    }

    if (processor) {
        return processor;
    }

    // This error will never be thrown, as a fallback processor will always be provided.
    throw new TypeError();
};
