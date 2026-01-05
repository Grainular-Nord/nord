import { type Grain, combined, derived, flattened, readonly } from '@grainular/grains';
import type { FormSchema } from './form-schema';

export const deriveSchemaValue = <T>(schema: FormSchema<T>): Grain<T> => {
    // Handle pure controls by returning the
    // direct control value
    if ('isControl' in schema) return readonly(schema.value);

    // We check for the 'controls' grain and array methods
    if ('isControlList' in schema) {
        return flattened(
            derived(schema.controls, (schemas) => {
                return combined(schemas.map(deriveSchemaValue));
            }),
        );
    }

    // Get all the child value grains
    const keyedValues = Object.entries(schema).map(([key, subSchema]) => {
        return { key, grain: deriveSchemaValue(subSchema) };
    });

    // Extract just the grains for 'combined'
    return derived(combined(keyedValues.map((entry) => entry.grain)), (values) => {
        // Reconstruct the object using the original keys and the new values
        return values.reduce((acc, val, index) => {
            const key = keyedValues[index].key;
            // @ts-expect-error
            acc[key] = val;
            return acc;
        }, {} as T);
    }) as Grain<T>;
};
