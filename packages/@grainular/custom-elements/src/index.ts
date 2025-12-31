import type { ComponentFragment } from '@grainular/nord';
import type { CustomElementDefinition } from './custom-element-definition';
import { CustomElementStyles } from './custom-element-styles';
import { GrainularElement } from './grainular-element';

export const createCustomElement = <T extends Lowercase<string> = never>(
    component: (ctx: GrainularElement<T>) => ComponentFragment,
    { selector, styles, ...opts }: CustomElementDefinition<T>,
) => {
    // Validate a correct custom element selector
    if (!/^[a-z][a-z0-9._]*-[a-z0-9._-]*$/.test(selector)) {
        throw new TypeError(`[grainular/custom-elements]: Selector <${selector}> needs to contain a hyphen.`);
    }

    // If a element with the selector exists we bail early
    if (customElements.get(selector)) return;

    const styleSheet = new CustomElementStyles(styles);

    // We can directly define the element by extending the abstract grainular element
    customElements.define(
        selector,
        class extends GrainularElement<T> {
            static get observedAttributes() {
                return opts.attributes?.map((entry) => entry.toLowerCase()) || [];
            }

            constructor() {
                super(opts, styleSheet);
            }

            connectedCallback(): void {
                // Mount the application
                this.mountApplication(component(this));
            }

            disconnectedCallback(): void {
                this.onDestroy();
            }

            attributeChangedCallback(name: T, _: string | null, newValue: string | null) {
                this.state.set({ [name]: newValue } as Record<T, string | null>);
            }
        },
    );
};
