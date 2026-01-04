import { createValidator } from './create-validator';

export const required = createValidator((control, setError, clearError) => {
    const value = control.value();

    if (typeof value !== 'string') {
        return value ? clearError() : setError();
    }

    value.trim() !== '' ? clearError() : setError();
});
