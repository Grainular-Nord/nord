import { type Control, type Validator, createValidator } from '@grainular/forms';

export const textLength: Validator<{ length: number }, string | null> = createValidator(
    (control: Control<string | null>, setError, clearError, { length }) => {
        const value = control.value();

        // If there is no value at all, we can bail
        if (value === null || value.trim() === '') {
            return clearError();
        }

        value.trim().length > length ? setError() : clearError();
    },
);
