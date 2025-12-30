import { type ComponentFragment, mount } from '@grainular/core';
import { ContextState } from './context-state';
import type { CustomElementDefinition } from './custom-element-definition';
import type { CustomElementStyles } from './custom-element-styles';

export abstract class GrainularElement<T extends Lowercase<string> = never> extends HTMLElement {
    abstract connectedCallback(): void;
    abstract disconnectedCallback(): void;

    #cleanup: (() => void) | null = null;
    #onMount?: () => void;
    #onUnmount?: () => void;
    #useShadow = true;
    #isConnected = false;
    state: ContextState<T>;
    styles: CustomElementStyles;

    constructor(
        { onMount, onUnmount, attributes = [], scoped = true }: Omit<CustomElementDefinition<T>, 'selector'>,
        styles: CustomElementStyles,
    ) {
        super();

        // Assign the respective callbacks for
        // the grainular element as well as the other
        // properties set by the constructor arg
        this.#onMount = onMount;
        this.#onUnmount = onUnmount;
        this.#useShadow = scoped;
        this.state = new ContextState(attributes);
        this.styles = styles;
    }

    private getTargetElement() {}

    protected mountApplication(fragment: ComponentFragment) {
        // If the element is already connected,
        // or a cleanup exists, unmount the component
        // before initializing it again.
        if (this.#isConnected || this.#cleanup) {
            this.onDestroy();
            this.#isConnected = false;
        }

        let target: ShadowRoot | Element = this;

        // If the component is configured to use shadow root
        // we attach the node and redeclare our target internally
        if (this.#useShadow) {
            target = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
        }

        // Attach the application root, store the cleanup
        // and call the onMount callback
        this.styles.attach(target);
        this.#cleanup = mount(() => fragment, { to: target });
        this.#isConnected = true;
        this.#onMount?.();
    }

    // Callback centralizing all cleanup and destroy
    // functionality.
    protected onDestroy() {
        this.#onUnmount?.();
        this.#cleanup?.();
        this.state.clear();
    }

    /**
     * Emits a event from the element that can be listened to.
     * Can be used to communicate with the outside if so required.
     *
     * @param event
     * @param payload
     * @param init
     */
    emit<T>(event: string, payload: T, init: CustomEventInit<T> = { bubbles: true, composed: true }) {
        this.dispatchEvent(new CustomEvent(event, { detail: payload, ...init }));
    }
}
