import type { FormSchema } from './form-schema';

export const setFormValue = <T>(schema: FormSchema<T>, model: T) => {
    // If we reached a leaf or a single control, we simply
    // set the value.
    if ('isControl' in schema) {
        schema.value.set(model);
    }

    // Lists have their own setter fn
    if ('isControlList' in schema && Array.isArray(model)) {
        schema.set(model);
    }

    if (typeof model === 'object' && model !== null) {
        for (const [key, value] of Object.entries(model)) {
            if (key in schema) {
                //@ts-expect-error Typescript unable to correctly nest the type here
                setFormValue(schema, value);
            }
        }
    }
};

export const resetFormValue = <T>(schema: FormSchema<T>) => {
    // Resetting leafs
    if ('isControl' in schema) {
        schema.reset();
    }

    // Resetting lists via their own resetter
    if ('isControlList' in schema) {
        schema.reset();
    }

    // Everything else should be reset
    // recursively, assuming a control tree
    for (const value of Object.values(schema)) {
        resetFormValue(value);
    }
};
