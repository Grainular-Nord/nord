/** @format */

import { toPascalCase } from '../../utils/to-pascal-case';
import { createElementDirective } from './create-element-directive';
import { createTemplateDirective } from './create-template-directive';

export const directives = [
    /**
     * Use directive. Used to execute arbitrary code on a node
     */
    createElementDirective('@use', (element, handler) => handler(element)),

    /**
     * For Each directive. This directive is used to loop over multiple elements and update the node list when a
     * underlying value changes (if it can change reactively)
     */
    createTemplateDirective('&forEach', (element, handler) => handler(element)),
    /**
     * If directive. This directive is used to create a boolean switch and render its templates accordingly
     */
    createTemplateDirective('&if', (element, handler) => handler(element)),
    // Event handlers
    createElementDirective('@event', (element, handler) => {
        handler(element);
    }),
    createElementDirective('@click', (element, handler) => {
        element.addEventListener('click', (ev) => handler(ev));
    }),
];
