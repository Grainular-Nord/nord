import type { Control } from './control';
import type { FormSchema } from './form-schema';

export const iterateSchema = <T>(schema: FormSchema<T>, run: (control: Control) => void) => {
    // If just control, run callback
    if ('isControl' in schema) {
        return run(schema as Control);
    }

    // Lists are deeply iterated
    if ('isControlList' in schema) {
        for (const control of schema.controls()) {
            iterateSchema(control, run);
        }
        return;
    }

    for (const value of Object.values(schema)) {
        iterateSchema(value, run);
    }
};
