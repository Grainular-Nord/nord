/** @format */

import { toPascalCase } from '../../utils/to-pascal-case';
import { createElementDirective } from './create-element-directive';
import { createTemplateDirective } from './create-template-directive';

export const directives = [
    /**
     * Prop directive. This directive is used to create and pass data to child components
     */
    createElementDirective('@props', (element, data) => {
        // check if the component exists in the global component registry
        // to check, tagName needs to be converted to pascal case
        if (!window.$$nord.components.has(toPascalCase`${element.tagName}`)) {
            return;
        }

        const component = window.$$nord.components.get(toPascalCase`${element.tagName}`);
        if (!component) {
            return;
        }

        element.replaceWith(...component(data, element.childNodes));
    }),
    // Event handlers
    createElementDirective('@click', (element, handler) => {
        element.addEventListener('click', (ev) => handler(ev));
    }),
];
