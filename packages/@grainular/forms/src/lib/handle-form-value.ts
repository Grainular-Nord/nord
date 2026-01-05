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
                setFormValue(schema[key], value);
            }
        }
    }
};
