/** @format */

import { Observable } from '../../types/observable';
import { getAttributeNameForValue } from '../../utils/get-attribute-name-for-value';
import { getStringValue } from '../../utils/get-string-value';
import { isElement } from '../../utils/is-element';
import { isText } from '../../utils/is-text';
import { createDirective } from './create-directive';

/**
 * Create a directive that binds an observable value to an element or text node's content or attribute.
 *
 * @param {Observable} value - The observable value to bind to the element.
 * @returns {Directive<Text | Element>} A directive function that binds the observable value to the element's content or attribute.
 *
 * @example
 * // Creating a reactive directive and using it in a component template
 * import { $, createComponent } from "@nord/core";
 * import { BehaviorSubject } from "rxjs";
 *
 * const myObservable = new BehaviorSubject(42);
 *
 * const myComponent = createComponent({
 *   template: (html) => html`
 *     <div>
 *       <p>Reactive Content: <span ${$(myObservable)}></span></p>
 *     </div>
 *   `,
 * });
 *
 * // Render the component and observe changes to myObservable
 * render(myComponent, { target: document.querySelector("#app") });
 * myObservable.subscribe((value) => {
 *   console.log("Observable Value:", value);
 * });
 */

export const reactive = (value: Observable) => {
    return createDirective((node: Text | Element, token: string) => {
        // If the node is a text node, the text content is simply replaced without further processing,
        // after stringifying it
        if (isText(node)) {
            // set up the subscription of the grain
            const unsubscribe = value.subscribe((val) => {
                if (!node.isConnected) {
                    unsubscribe();
                }

                node.textContent = getStringValue(val);
            });
        }

        /**
         * If the node is a Element, the value exists in an attribute as value.
         */
        if (isElement(node)) {
            const attrName = getAttributeNameForValue(node, token);
            let curAttrValue = token;
            if (attrName) {
                // If a attribute was found, that contains the grain value as token,
                // set up the subscription
                const unsubscribe = value.subscribe((val) => {
                    if (!node.isConnected) {
                        unsubscribe();
                    }

                    // Enable partial replacing inside of attribute nodes
                    const updatedValue = node.getAttribute(attrName)!.replace(curAttrValue, getStringValue(val));
                    curAttrValue = val;

                    node.setAttribute(attrName, updatedValue);
                });
            }

            // Attribute name
            if (node.hasAttribute(token)) {
                const unsubscribe = value.subscribe((val) => {
                    if (!node.isConnected) {
                        unsubscribe();
                    }

                    const attrNameValue = getStringValue(val);
                    if (attrNameValue.match(/^([0-9]| )?$/gim)) {
                        console.warn(
                            `[Nørd:Directive]: You are trying to set an invalid string as attribute name. --> ${attrNameValue}`
                        );
                        return;
                    }

                    node.setAttribute(attrNameValue, '');
                });

                if (node.hasAttribute(token)) {
                    node.removeAttribute(token);
                }
            }
        }
    });
};
