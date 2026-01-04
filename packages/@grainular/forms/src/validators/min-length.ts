import type { Control } from '../../dist/types';
import { type Validator, createValidator } from './create-validator';

export const minLength: Validator<{ min: number }, unknown[]> = createValidator(
    (control: Control<unknown[]>, setError, clearError, { min }) => {
        const value = control.value();

        if (!Array.isArray(value) || (Array.isArray(value) && value.length >= min)) return clearError();
        value.length < min && setError();
    },
);
