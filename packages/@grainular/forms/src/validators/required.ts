import { createValidator } from './create-validator';

export const required = createValidator((control, setError, clearError) => {
    control.value() ? clearError() : setError();
});
