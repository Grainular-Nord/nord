import type { PureComponent } from '../component/pure-component';
import { fragmentMap } from '../component/template-parser';
import { deletionObserver } from '../internals/deletion-observer';
import { hydrateClient } from './hydrate-client';

type MountOptions = {
    to: Element | null | undefined;
};

export const mount = (component: PureComponent<undefined>, opts: MountOptions) => {
    if (!opts.to) {
        throw new ReferenceError('Target element is undefined.');
    }
    // render the template
    const fragment = document.createElement('template');
    fragment.innerHTML = component().resolve();

    // Hydrate the nodes
    hydrateClient(fragment.content, fragmentMap);
    opts.to.appendChild(fragment.content);
    deletionObserver.observe(opts.to);
};
