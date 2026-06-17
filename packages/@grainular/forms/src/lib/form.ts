import { combined, derived, type Grain } from '@grainular/grains';
import { deriveSchemaErrors } from './derive-schema-errors';
import { deriveSchemaTouched } from './derive-schema-touched';
import { deriveSchemaValue } from './derive-schema-value';
import { createFormSchema, type FormSchema } from './form-schema';
import { setFormValue } from './handle-form-value';
import { touchAll } from './touch-all';

export type Form<T> = {
    value: Grain<T>;
    controls: FormSchema<T>;
    errors: Grain<string[]>;
    isValid: Grain<boolean>;
    isTouched: Grain<boolean>;
    validate: () => boolean;
    set: (value: T) => void;
    reset: () => void;
};

/**
 *
 * @param model
 * @param schema
 */
export const form = <T extends Record<PropertyKey, unknown>>(
    model: T,
    schema: (state: FormSchema<T>) => void = () => {},
): Form<T> => {
    const controls = createFormSchema(model);
    const value = deriveSchemaValue(controls);
    const errors = deriveSchemaErrors(controls);
    const isValid = derived(errors, (errors) => errors.length === 0);

    // Touch states
    const touchStates = deriveSchemaTouched(controls);
    const isTouched = derived(touchStates, (states) => states.some(Boolean));

    // Create the form setter and reset fn
    const set = (value: T) => setFormValue(controls, value);
    const reset = () => set(model);
    const validate = () => {
        touchAll(controls);
        schema(controls);
        return errors().length === 0;
    };

    // Track value changes and run the schema fn
    // whenever the value changes and once on creation
    schema(controls);
    combined([value, touchStates]).subscribe(() => schema(controls));

    // Return the created form object
    return { controls, value, errors, isValid, isTouched, set, reset, validate };
};
