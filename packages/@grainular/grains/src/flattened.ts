import type { Grain } from '../dist/types';
import { grain } from './grain';
import { readonly } from './readonly';

export const flattened = <T>(nested: Grain<Grain<T>>): Grain<T> => {
    // Initialize the result grain
    const result = grain(nested()());

    let innerUnsubscribe: (() => void) | null = null;

    // We subscribe to the primary grain (outer basically)
    // and can then update the result accordingly
    // we make sure to track the unsubscribe
    nested.subscribe((innerGrain) => {
        if (innerUnsubscribe) innerUnsubscribe();
        result.set(innerGrain());

        // update the subscription tracker
        innerUnsubscribe = innerGrain.subscribe((value) => {
            result.set(value);
        });
    });

    return readonly(result);
};
