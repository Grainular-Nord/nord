import { type Grain, type WritableGrain, derived, grain } from '@grainular/grains';
import { type Fragment, createDirective } from '@grainular/nord';
import { getBinding } from './value-binding';

type ControlBindingOptions = {
    event?: 'change' | 'input' | 'blur';
};

export type Control<V = unknown> = {
    isControl: true;
    id: string;

    // Writable state
    value: WritableGrain<V>;
    errors: WritableGrain<string[]>;
    disabled: WritableGrain<boolean>;

    // Derived / event state
    isValid: Grain<boolean>;
    focused: WritableGrain<boolean>;
    touched: WritableGrain<boolean>;

    // Resets the value
    reset: () => void;

    // The directive used to bind
    // to the input element, using
    // a event
    bind: (options?: ControlBindingOptions) => Fragment;
};

const handleNodeDisabledState = (node: Element, disabled: Grain<boolean>) => {
    disabled() ? node.setAttribute('disabled', '') : node.removeAttribute('disabled');

    return disabled.subscribe((state) => {
        state ? node.setAttribute('disabled', '') : node.removeAttribute('disabled');
    });
};

const handleNodeFocusState = (node: Element, setTouched: () => void, setFocused: () => void, blur: () => void) => {
    const handler = (event: Event) => {
        if (event.type === 'focus') {
            setTouched();
            setFocused();
        }

        if (event.type === 'blur') {
            blur();
        }
    };

    node.addEventListener('focus', handler);
    node.addEventListener('blur', handler);

    return () => {
        node.removeEventListener('focus', handler);
        node.removeEventListener('blur', handler);
    };
};

const handleNodeValueBinding = <V>(node: Element, value: WritableGrain<V>, event: string) => {
    const { get, set } = getBinding(node);
    set(value());

    const handler = () => value.set(get() as V);
    node.addEventListener(event, handler);

    const cleanup = value.subscribe((value) => {
        set(value);
    });

    return () => {
        node.removeEventListener(event, handler);
        cleanup();
    };
};

// Function to set up the control binding
// to the control node. This is will be a
const createControlBinding = <V>(
    { event }: Required<ControlBindingOptions>,
    setTouched: () => void,
    setFocused: () => void,
    blur: () => void,
    disabled: Grain<boolean>,
    value: WritableGrain<V>,
) => {
    return createDirective((node) => {
        // The bindings between the node and the state
        // needs to track multiple different states and
        // attributes.
        const resolveDisabledState = handleNodeDisabledState(node, disabled);
        const resolveFocusState = handleNodeFocusState(node, setTouched, setFocused, blur);
        const resolveValueBinding = handleNodeValueBinding(node, value, event);

        return () => {
            resolveDisabledState();
            resolveFocusState();
            resolveValueBinding();
        };
    });
};

/**
 * Method to create a reactive control with
 * methods to retrieve the value and create
 * a binding
 * @param value
 */
export const control = <V>(initialValue: V): Control<V> => {
    const value = grain(initialValue);
    const errors = grain<string[]>([]);
    const disabled = grain(false);

    const isValid = derived(errors, (errors) => errors.length === 0);
    const touched = grain(false);
    const focused = grain(false);

    const reset = () => {
        errors.set([]);
        touched.set(false);
        focused.set(false);
        value.set(initialValue);
    };

    const touch = () => {
        touched.set(true);
    };

    const binding = (options: Required<ControlBindingOptions>) => {
        return createControlBinding<V>(
            options,
            () => touched.set(true),
            () => focused.set(true),
            () => focused.set(false),
            disabled,
            value,
        );
    };

    return {
        id: crypto.randomUUID(),
        isControl: true,
        value,
        errors,
        disabled,
        isValid,
        touched,
        focused,
        reset,
        bind: (options: ControlBindingOptions = {}) => {
            return binding({ event: 'input', ...options });
        },
    };
};
