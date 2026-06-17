import { grain } from '@grainular/grains';
import { $render, type ComponentFragment, html, type Ref } from '@grainular/nord';
import type { Router, RouterStateSnapshot } from './create-router';

type OutletConfig = {
    for: Router;
    transitionElement?: Ref<HTMLElement>; // user provides the element to transition
};

export const $outlet = ({ for: router, transitionElement: transitionRef }: OutletConfig) => {
    const currentComponent = grain<ComponentFragment>(html``);
    const name = `outlet-${router.base.replace(/[^a-zA-Z0-9-_]/g, '') || 'root'}`;

    const setComponent = (state: RouterStateSnapshot) => {
        const { component, route } = state;
        const next = component ?? html``;
        if (!route?.transition) return currentComponent.set(next);

        // Apply view-transition-name to user's element or fall back to documentElement
        const target = transitionRef?.current ?? document.documentElement;
        target.style.viewTransitionName = name;

        const viewTransition = document.startViewTransition(() => currentComponent.set(next));
        viewTransition.ready.then(() => {
            const animations = [route.transition ?? []].flat();
            animations.forEach(({ keyframes, ...props }) => {
                document.documentElement.animate(keyframes, {
                    pseudoElement: props.element?.replace('(root)', `(${name})`)?.replace('(outlet)', `(${name})`),
                    ...props,
                });
            });
        });
    };

    setComponent(router.state());
    router.state.subscribe(setComponent);

    router.attach();
    return $render(currentComponent);
};
