import type { Control } from '../lib/control';
import { type Validator, createValidator } from './create-validator';

export const max: Validator<{ max: number }, number | null> = createValidator(
    (control: Control<number | null>, setError, clearError, { max }) => {
        const value = control.value();

        if (value === null || typeof value !== 'number') return clearError();
        value <= max ? clearError() : setError();
    },
);
