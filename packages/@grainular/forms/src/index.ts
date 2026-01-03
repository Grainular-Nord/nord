import type { Grain } from '@grainular/grains';
import { deriveSchemaErrors } from './derive-schema-errors';
import { deriveSchemaValue } from './derive-schema-value';
import { type FormSchema, createFormSchema } from './form-schema';
import { resetFormValue, setFormValue } from './handle-form-value';

export type Form<T> = {
    value: Grain<T>;
    controls: FormSchema<T>;
    errors: Grain<string[]>;
    set: (value: T) => void;
    reset: () => void;
};

/**
 *
 * @param model
 * @param schema
 */
const form = <T extends Record<PropertyKey, unknown>>(
    model: T,
    schema: (state: FormSchema<T>) => void = () => {},
): Form<T> => {
    const controls = createFormSchema(model);
    const value = deriveSchemaValue(controls);
    const errors = deriveSchemaErrors(controls);

    // Create the form setter and reset fn
    const set = (value: T) => setFormValue(controls, value);
    const reset = () => resetFormValue(controls);

    // Track value changes and run the schema fn
    value.subscribe(() => schema(controls));

    // Return the created form object
    return { controls, value, errors, set, reset };
};

export { control, type Control } from './control';
export { $controlErrors } from './structs/control-errors.struct';
export { createValidator } from './validators/create-validator';
export { max } from './validators/max';
export { min } from './validators/min';
export { required } from './validators/required';
export { form };
