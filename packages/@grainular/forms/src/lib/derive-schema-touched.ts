import { type Grain, combined, derived, flattened } from '@grainular/grains';
import type { FormSchema } from './form-schema';

export const deriveSchemaTouched = <T>(schema: FormSchema<T>): Grain<boolean[]> => {
    // Normalize the nullable errors state
    if ('isControl' in schema) {
        return derived(schema.touched, (errors) => [errors]);
    }

    // Lists are deeply flattened and normalized
    if ('isControlList' in schema) {
        return flattened(
            derived(schema.controls, (schemas) => {
                return schemas.map((s) => deriveSchemaTouched(s));
            }),
        );
    }

    // Anything else is flattened
    return derived(
        combined(
            Object.values(schema).map((subSchema) => {
                return deriveSchemaTouched(subSchema);
            }),
        ),
        (nested) => nested.flat(),
    );
};
