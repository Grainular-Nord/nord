import type { Control } from '../lib/control';
import { type Validator, createValidator } from './create-validator';

const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const email: Validator<Record<string, never>, string | null> = createValidator(
    (control: Control<string | null>, setError, clearError) => {
        const value = control.value();

        // Empty values are valid (handled by 'required')
        if (value === null || value === '') {
            return clearError();
        }

        EMAIL_REGEX.test(value) ? clearError() : setError();
    },
);
