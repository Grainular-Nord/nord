/** @format */

import { ReadonlyGrain } from '../../types';
import { PropType } from '../../types/enums/prop-type.enum';
import { PropProcessor } from '../../types/prop-processor';
import { getAttributeNameForValue } from '../../utils/get-attribute-name-for-value';
import { getStringValue } from '../../utils/get-string-value';
import { isElement } from '../../utils/is-element';
import { isText } from '../../utils/is-text';
import { TemplateDirective, ToStringTypes } from './evaluate-component-template';

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
             * @todo -> Set up unsubscribers and set up a way to unsubscribe if the template is destroyed
             */

            // If the node is a text node, the text content is simply replaced without further processing,
            // after stringifying it
            if (isText(node)) {
                const tokenIndex = node.data.indexOf(token);
                const grainNode = node.splitText(tokenIndex);
                grainNode.splitText(token.length);

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
    // Directive Parser
    [
        PropType.DIRECTIVE,
        (node, token, value: TemplateDirective) => {
            console.log({ node, token, value });
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

    throw new Error();
};
