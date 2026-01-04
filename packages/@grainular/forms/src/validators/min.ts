import type { Control } from '../lib/control';
import { type Validator, createValidator } from './create-validator';

export const min: Validator<{ min: number }, number | null> = createValidator(
    (control: Control<number | null>, setError, clearError, { min }) => {
        const value = control.value();

        if (value === null || typeof value !== 'number') return clearError();
        value >= min ? clearError() : setError();
    },
);
