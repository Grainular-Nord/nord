import { type Grain, combined, derived, flattened } from '@grainular/grains';
import type { FormSchema } from './form-schema';

export const deriveSchemaErrors = <T>(schema: FormSchema<T>): Grain<string[]> => {
    // Normalize the nullable errors state
    if ('isControl' in schema) {
        return derived(schema.errors, (errors) => errors);
    }

    // Lists are deeply flattened and normalized
    if ('isControlList' in schema) {
        return flattened(
            derived(schema.controls, (schemas) => {
                const errorGrains = schemas.map((s) => deriveSchemaErrors(s));
                return derived(combined(errorGrains), (nested) => nested.flat());
            }),
        );
    }

    // Anything else is flattened
    return derived(
        combined(
            Object.values(schema).map((subSchema) => {
                return deriveSchemaErrors(subSchema);
            }),
        ),
        (nested) => nested.flat(),
    );
};
