import type { Control } from '../lib/control';
import { createValidator, type Validator } from './create-validator';

export const minLength: Validator<{ min: number }, unknown[]> = createValidator(
    (control: Control<unknown[]>, setError, clearError, { min }) => {
        const value = control.value();

        if (!Array.isArray(value) || (Array.isArray(value) && value.length >= min)) return clearError();
        value.length < min && setError();
    },
);
