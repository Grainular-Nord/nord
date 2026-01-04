import type { ControlList } from '../lib/control-list';
import type { FormSchema } from '../lib/form-schema';

export const validateEach = <T>(control: ControlList<T>, schemaFn: (schema: FormSchema<T>, idx: number) => void) => {
    control.controls().forEach((control, idx) => schemaFn(control, idx));
};
