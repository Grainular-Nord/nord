import { type Grain, derived } from '@grainular/grains';
import { deriveSchemaErrors } from './derive-schema-errors';
import { deriveSchemaValue } from './derive-schema-value';
import { type FormSchema, createFormSchema } from './form-schema';
import { setFormValue } from './handle-form-value';
import { iterateSchema } from './iterate-schema';

export type Form<T> = {
    value: Grain<T>;
    controls: FormSchema<T>;
    errors: Grain<string[]>;
    isValid: Grain<boolean>;
    validate: () => boolean;
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
    const isValid = derived(errors, (errors) => errors.length === 0);

    // Create the form setter and reset fn
    const set = (value: T) => setFormValue(controls, value);
    const reset = () => iterateSchema(schema, (control) => control.reset());
    const validate = () => {
        iterateSchema(controls, (control) => control.touched.set(true));
        schema(controls);
        return errors().length === 0;
    };

    // Track value changes and run the schema fn
    // whenever the value changes and once on creation
    schema(controls);
    value.subscribe(() => schema(controls));

    // Return the created form object
    return { controls, value, errors, isValid, set, reset, validate };
};

export { control, type Control } from './control';
export { $controlErrors } from './structs/control-errors.struct';
export { createValidator, type Validator } from './validators/create-validator';
export { max } from './validators/max';
export { min } from './validators/min';
export { required } from './validators/required';
export { form };
