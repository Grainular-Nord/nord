/**
 * Asserts that a given value is a primitive value
 * @param value
 */
export const isPrimitiveValue = (value: unknown): value is string | boolean | number => {
    return ['string', 'boolean', 'number'].includes(typeof value);
};
