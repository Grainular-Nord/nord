/** @format */

/**
 * This type encompasses a variety of basic types and their array forms, each of which
 * can be easily represented as a string.
 *
 * The type includes the following:
 * - `string`: Standard string values.
 * - `number`: Numeric values.
 * - `boolean`: Boolean values (true or false).
 * - `BigInt`: Large integer values represented by the BigInt type.
 * - `undefined`: The undefined value.
 * - `null`: The null value.
 * - `ToStringTypes[]`: An array of values, each of which is of a type that can be converted to a string.
 *
 * This type is useful in scenarios where values need to be converted to a string for display,
 * serialization, or other forms of processing where string representation is necessary.
 *
 * @example
 * // Example of using ToStringTypes in a function
 * function convertToString(value: ToStringTypes): string {
 *   if (Array.isArray(value)) {
 *     return value.map(convertToString).join(', ');
 *   }
 *   return String(value);
 * }
 *
 * // This function can take various types and reliably convert them to a string.
 */

export type ToStringTypes = string | number | boolean | BigInt | undefined | null | ToStringTypes[];
