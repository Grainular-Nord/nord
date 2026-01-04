import type { Control } from '../../dist/types';
import { type Validator, createValidator } from './create-validator';

export const maxLength: Validator<{ max: number }, unknown[]> = createValidator(
    (control: Control<unknown[]>, setError, clearError, { max }) => {
        const value = control.value();

        if (!Array.isArray(value) || (Array.isArray(value) && value.length <= max)) return clearError();
        value.length > max && setError();
    },
);
