// --- Interfaces ---
type Binding = {
    get: () => unknown;
    set: (value: unknown) => void;
};

type Predicate = (node: Element) => boolean;
type Factory = (node: Element) => Binding;

// Mocking the Grain interface based on your request
interface WritableGrain<V> {
    set(value: V): void;
    subscribe(subscriber: (value: V) => void): () => void;
}

// --- The Dictionary ---
const bindings = new Map<Predicate, Factory>([
    // 1. Checkbox & Radio
    [
        (node) => node instanceof HTMLInputElement && (node.type === 'checkbox' || node.type === 'radio'),
        (node) => {
            const input = node as HTMLInputElement;
            return {
                get: () => input.checked,
                set: (val) => {
                    input.checked = Boolean(val);
                },
            };
        },
    ],
    // 2. File Input (Read-Only)
    [
        (node) => node instanceof HTMLInputElement && node.type === 'file',
        (node) => {
            const input = node as HTMLInputElement;
            return {
                get: () => input.files,
                set: () => {
                    /* No-op: File inputs are security locked */
                },
            };
        },
    ],
    // 3. Multi-Select
    [
        (node) => node instanceof HTMLSelectElement && node.type === 'select-multiple',
        (node) => {
            const select = node as HTMLSelectElement;
            return {
                get: () => Array.from(select.selectedOptions, (opt) => opt.value),
                set: (val) => {
                    const values = Array.isArray(val) ? val : [val];
                    for (const option of select.options) {
                        option.selected = values.includes(option.value);
                    }
                },
            };
        },
    ],
    // 4. Numeric Inputs (Number & Range)
    [
        (node) => node instanceof HTMLInputElement && (node.type === 'number' || node.type === 'range'),
        (node) => {
            const input = node as HTMLInputElement;
            return {
                get: () => (input.value === '' ? null : input.valueAsNumber),
                set: (val) => {
                    input.value = String(val ?? '');
                },
            };
        },
    ],
    // 5. Default Fallback (Text, Textarea, Single Select, etc.)
    [
        (node) =>
            node instanceof HTMLInputElement ||
            node instanceof HTMLTextAreaElement ||
            node instanceof HTMLSelectElement,
        (node) => {
            // Safe to cast to generic input interface usually, or just use 'value' property
            const input = node as HTMLInputElement;
            return {
                get: () => input.value,
                set: (val) => {
                    input.value = String(val ?? '');
                },
            };
        },
    ],
]);

export const getBinding = (node: Element): Binding => {
    for (const [predicate, factory] of bindings) {
        if (predicate(node)) return factory(node);
    }
    // Fallback for non-form elements (or throw error)
    return { get: () => null, set: () => {} };
};

export const getValue = (node: Element) => {
    return getBinding(node).get();
};

export const setValue = <T>(node: Element, value: T) => {
    getBinding(node).set(value);
};
