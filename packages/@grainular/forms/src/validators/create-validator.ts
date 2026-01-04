import type { Control } from '../lib/control';
import { clearControlError, setControlError } from './core';

type ValidatorData<T> = T & { message: string };
type ValidatorFn<Opts, T> = (
    control: Control<T>,
    setError: () => void,
    clearError: () => void,
    opts: Omit<ValidatorData<Opts>, 'message'>,
) => void;

// We need to provide this type explicitly to
// avoid invariance problems. Sucks but that's
// the price to pay for type safe validators.
export type Validator<Opts, T> = <V extends T>(control: Control<V>, opts: ValidatorData<Opts>) => void;

export const createValidator = <Opts extends Record<PropertyKey, unknown>, T>(
    validatorFn: ValidatorFn<Opts, T>,
): Validator<Opts, T> => {
    return <V extends T>(control: Control<V>, { message, ...opts }: ValidatorData<Opts>) => {
        // Casting the control makes it work. This should
        // be fine, as we only ever read the value of the
        // control.
        const castControl = control as unknown as Control<T>;

        const setError = () => setControlError(castControl, message);
        const clearError = () => clearControlError(castControl, message);
        if (control.touched()) {
            validatorFn(castControl, setError, clearError, opts);
        }
    };
};
