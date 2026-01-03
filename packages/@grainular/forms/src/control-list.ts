import { type WritableGrain, grain } from '@grainular/grains';
import { type FormSchema, createFormSchema } from './form-schema';

export type ControlList<T> = {
    isControlList: true;
    controls: WritableGrain<FormSchema<T>[]>;
    add: (value: T) => void;
    remove: (filterFn: (control: FormSchema<T>) => boolean) => void;
    at: (idx: number) => FormSchema<T> | undefined;

    reset: () => void;
    set: (value: T[]) => void;
};

export const controlList = <T>(initialValues: T[]): ControlList<T> => {
    const initialSchemas = initialValues.map((v) => createFormSchema(v));
    const controls = grain(initialSchemas);

    return {
        isControlList: true,
        controls,

        // Add: Create the schema for the new value and push it to the state
        add: (value: T) => {
            const schema = createFormSchema(value);
            controls.update((current) => [...current, schema]);
        },

        // Remove: Filter the array by comparator
        remove: (filterFn: (controls: FormSchema<T>) => boolean) => {
            controls.update((current) => {
                return [...current.filter((control) => filterFn(control))];
            });
        },

        // At: Access the reactive schema at a specific index
        // (Note: This returns the SCHEMA, so you can do .at(0).value() or .at(0).bind())
        at: (idx: number) => {
            return controls()[idx];
        },

        set: (value: T[]) => {
            // No reconciliation here, as we never know how the values
            // passed actually relate. Better to just overwrite completely
            const updatedSchema = value.map((value) => createFormSchema(value));
            controls.set(updatedSchema);
        },

        // Reset's the control to it's
        // initial value
        reset: () => {
            controls.set(initialSchemas);
        },
    };
};
