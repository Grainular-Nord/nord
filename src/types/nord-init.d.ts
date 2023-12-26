/** @format */

import { ComponentProps } from './component-props';

/**
 * Represents the initialization options for rendering a component to the DOM.
 *
 * @param {ComponentProps} HydrationProps - The type of properties used for initial hydration of the component.
 *
 * @property {Element | null} target - The DOM element where the component should be rendered. This is mandatory.
 * @property {HydrationProps} [hydrate] - Optional properties used for initial hydration of the component. These properties
 *     are passed to the component when it is first rendered.
 *
 * @template HydrationProps - The type of properties used for initial hydration of the component.
 *
 * @example
 * // Example of rendering a component to the DOM with initial hydration
 * import { createComponent, render } from "@nord/core";
 *
 * // Create a component
 * const app = createComponent({
 *     template: (html, { count }) => html`
 *         <main>
 *             <button ${on('click', () => count.update((c) => c + 1))}>
 *                 Count is: ${count}
 *             </button>
 *         </main>
 *     `,
 * });
 *
 *
 * // Render the component to the DOM with initial hydration
 * render(app, { target: document.querySelector('#app'), hydrate: {count: grain(0)} });
 */

export type NordInit<HydrationProps extends ComponentProps = {}> = {
    /**
     * The target DOM element where the component should be rendered.
     *
     * @type {Element | null}
     */
    target: Element | null;
    /**
     * Optional properties for hydrating the component.
     *
     * @template HydrationProps - The type of properties used for component hydration.
     * @type { HydrationProps }
     */
    hydrate?: HydrationProps;
};
