import { grain } from '@grainular/grains';
import { $render, type ComponentFragment, html } from '@grainular/nord';
import type { Router } from './create-router';

type OutletConfig = {
    for: Router;
};
export const $outlet = ({ for: router }: OutletConfig) => {
    const currentComponent = grain<ComponentFragment>(html``);

    router.state.subscribe((state) => {
        const { component, route } = state;
        const next = component ?? html``;
        const name = `outlet-${router.base}`;
        if (!route?.transition) return currentComponent.set(next);

        const viewTransition = document.startViewTransition(() => currentComponent.set(next));
        viewTransition.ready.then(() => {
            const animations = [route.transition ?? []].flat();
            animations.forEach(({ keyframes, ...props }) => {
                document.documentElement.animate(keyframes, {
                    pseudoElement: props.element?.replace('(root)', `(${name})`).replace('(outlet)', `(${name})`),
                    ...props,
                });
            });
        });
    });

    return html`
        <div style="display: contents; view-transition-name: outlet-${router.base}">
            ${$render(currentComponent)}
        <div>`;
};
