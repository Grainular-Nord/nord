/** @format */

import { createDirective } from './create-directive';

export const directives = [
    createDirective('@click', (element, handler) => {
        element.addEventListener('click', (ev) => handler(ev));
    }),
];
