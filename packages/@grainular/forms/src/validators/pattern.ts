import type { Control } from '../lib/control';
import { type Validator, createValidator } from './create-validator';

export const pattern: Validator<{ regex: RegExp }, string | null> = createValidator(
    (control: Control<string | null>, setError, clearError, { regex }) => {
        const value = control.value();

        // If the value is empty/null, we clear the error.
        // We leave emptiness checks to the 'required' validator.
        if (value === null || value === '') {
            return clearError();
        }

        // Test the regex against the value
        regex.test(value) ? clearError() : setError();
    },
);
