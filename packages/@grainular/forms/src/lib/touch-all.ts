import type { FormSchema } from './form-schema';
import { iterateSchema } from './iterate-schema';

export const touchAll = <T>(controls: FormSchema<T>) => {
    iterateSchema(controls, (control) => control.touched.set(true));
};
