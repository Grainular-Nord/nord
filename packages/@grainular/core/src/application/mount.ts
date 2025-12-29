import type { PureComponent } from '../component/component-types';
import { lifecycleObserver } from './lifecycle-observer';

type MountOptions = {
    to: Element | null | undefined;
};

/**
 * Mounts a `PureComponent` into a target DOM element.
 *
 * It ensures the application bootstraps correctly by enforcing that the
 * mount target is a valid `Element`.+
 *
 * @example
 * ```ts
 * import { mount } from "@grainular/core";
 * import App from "./app.ts";
 *
 * mount(App, { to: document.querySelector("#app") })
 * ```
 *
 * @throws {ReferenceError} If the target element is not a valid `Element`.
 */

export const mount = (component: PureComponent, { to: target }: MountOptions) => {
    // We really want to make sure that the target element is defined,
    // As otherwise the whole application start will fail.
    if (!target || !(target instanceof Element))
        throw new ReferenceError('Target element is undefined or not an Element');

    // Create a new fragment and build the application
    // dom inside it. This allows to swap the dom without
    // creating layout trashing with concurrent hydration
    const anchor = new Comment();
    const fragment = document.createDocumentFragment();
    fragment.appendChild(anchor);

    // Start the lifecycle and hydrate
    // the component.
    lifecycleObserver.start(target);
    component().hydrate(anchor);

    // Update the nodes and render the application
    // to the actual dom. This will remove all
    // existing nodes, meaning if there was a ssr
    // render beforehand, it's now gone
    target.replaceChildren(fragment);

    // Return a cleanup fn.
    return () => {
        lifecycleObserver.disconnect();
    };
};
