/** @format */

import { Directive } from './types';

/**
 * Represents an ElementRefDirective, which is a custom directive that provides access
 * to the native DOM element associated with a component in the framework.
 *
 * @template ElementType - The type of the native DOM element associated with the component.
 *
 * @typedef {Directive<Element> & {
 *   nativeElement: ElementType;
 * }} ElementRefDirective
 */

export type ElementRefDirective<ElementType extends Element = Element> = Directive<Element> & {
    /**
     * Represents the native DOM element associated with a component in the framework.
     *
     * @name nativeElement
     * @type {ElementType}
     * @memberof ElementRefDirective
     * @instance
     */
    nativeElement: ElementType;
};
