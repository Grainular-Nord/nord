import { disconnectNodes } from '../application/lifecycle-observer';
import type { PureComponent } from '../component/component-types';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { createDirective } from './create-directive';

export type Portal = {
    attach: (component: PureComponent) => () => void;
};

export const createPortal = (target: Element | undefined | null): Portal => {
    return {
        attach: (component: PureComponent) => {
            if (!target) throw new ReferenceError('[Nord] Portal target not defined');

            const nodes = hydrateFragment(component());
            target.append(...nodes);

            return () => {
                disconnectNodes(nodes);
            };
        },
    };
};

export const portal = (target: Element | undefined | null) => {
    return createDirective((node) => {
        if (!target) throw new ReferenceError('[Nord] Portal target not defined');

        target.appendChild(node);

        return () => {
            target.removeChild(node);
        };
    });
};
