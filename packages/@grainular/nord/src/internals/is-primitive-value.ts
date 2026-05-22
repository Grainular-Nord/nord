/**
 * Asserts that a given value is a primitive value
 * @param value
 */
export const isPrimitiveValue = (value: unknown): value is string | boolean | number | bigint => {
    return ['string', 'boolean', 'number', 'bigint'].includes(typeof value);
};
