import { type Validator, createValidator } from './create-validator';

export const max: Validator<{ max: number }, number | null> = createValidator(
    (control, setError, clearError, { max }) => {
        const value = control.value();

        if (value === null || typeof value !== 'number') return clearError();
        value <= max ? clearError() : setError();
    },
);
