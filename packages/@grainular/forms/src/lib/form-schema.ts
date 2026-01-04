import { type Control, control } from './control';
import { type ControlList, controlList } from './control-list';

// Helper to stop recursion on simple types (including Date)
type Primitive = string | number | boolean | Date | null | undefined;

// Providing a type that maps models
// into a schema using lists and controls
export type FormSchema<T> = [T] extends [Primitive]
    ? Control<T>
    : T extends Array<infer U>
      ? ControlList<U>
      : { [K in keyof T]: FormSchema<T[K]> };

export const createFormSchema = <T>(value: T): FormSchema<T> => {
    // Lists are parsed out
    if (Array.isArray(value)) {
        return controlList(value) as FormSchema<T>;
    }

    // Objects are converted to a nested tree
    if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        const groupEntries = Object.entries(value).map(([key, val]) => {
            return [key, createFormSchema(val)];
        });
        return Object.fromEntries(groupEntries) as FormSchema<T>;
    }

    // C) It is a Primitive -> Create a Leaf Control
    // We wrap the raw value in a grain to make it reactive
    return control(value) as FormSchema<T>;
};
