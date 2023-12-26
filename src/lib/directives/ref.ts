/** @format */

import { Directive } from '../../types';
import { createDirective } from './create-directive';

/**
 * Creates a ref directive that allows you to access the native DOM element associated with an element in your template.
 * This is useful when you need to interact with the DOM element directly.
 *
 * @template {Element} NativeElement - The type of the native DOM element.
 *
 * @returns {Directive<Element> & { nativeElement: NativeElement }} A ref directive object with a `nativeElement` property that
 *     provides access to the associated DOM element.
 *
 * @example
 * // Example of using a ref directive to access a DOM element
 * import { createComponent, ref } from "@nord/core";
 *
 * const app = createComponent({
 *     template: (html) => {
 *         const myRef = ref(); // Create a ref directive
 *
 *         // Attach the ref directive to an element
 *         return html`
 *             <div ${myRef}></div>
 *         `;
 *     },
 * });
 *
 * // Render the component
 * render(app, { target: document.querySelector('#app') });
 *
 * // Access the native DOM element using the ref directive
 * const element = myRef.nativeElement; // Access the DOM element
 * element.style.color = "red"; // Modify the DOM element's style
 */

export const ref = <NativeElement extends Element = Element>() => {
    let _ref: NativeElement | null = null;

    const directive = createDirective((element: Element) => {
        _ref = element as NativeElement;
    });

    Object.defineProperties(directive, {
        nativeElement: {
            get: () => _ref,
        },
    });

    return directive as Directive<Element> & { nativeElement: NativeElement };
};
