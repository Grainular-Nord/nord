import type { WritableGrain } from '@grainular/grains';
import { createDirective } from '@grainular/nord';
import { bind } from '../directives/bind.directive';
import { control, type Control } from './control';
import type { ControlList } from './control-list';
import { deriveSchemaValue } from './derive-schema-value';

/**
 * Binds a list of strings to a single multiple select control.
 */
export const multiselect = (list: ControlList<string>, options?: Parameters<Control<string[]>['bind']>[0]) => {
    const value = deriveSchemaValue<string[]>(list);
    const initialValue = value();
    const state = control(initialValue);
    const writable: WritableGrain<string[]> = Object.assign(() => value(), {
        subscribe: value.subscribe,
        set: list.set,
        update: (run: (current: string[]) => string[]) => list.set(run(value())),
    });

    const createBinding: Control<string[]>['bind'] = (options = {}) =>
        createDirective((node, lifecycle) => {
            bind(writable, options.updateOn).hydrate(node, { lifecycle });

            const focus = () => state.focused.set(true);
            const blur = () => {
                state.touched.set(true);
                state.focused.set(false);
            };
            node.addEventListener('focus', focus);
            node.addEventListener('blur', blur);

            const setDisabled = (disabled: boolean) => {
                disabled ? node.setAttribute('disabled', '') : node.removeAttribute('disabled');
            };
            setDisabled(state.disabled());
            const onDisabled = state.disabled.subscribe(setDisabled);
            const onValue = writable.subscribe(() => state.dirty.set(true));

            return () => {
                node.removeEventListener('focus', focus);
                node.removeEventListener('blur', blur);
                onDisabled();
                onValue();
            };
        });

    const reset = () => {
        list.set(initialValue);
        state.errors.set([]);
        state.touched.set(false);
        state.focused.set(false);
        state.dirty.set(false);
    };
    return Object.assign(createBinding(options), {
        control: { ...state, value: writable, reset, bind: createBinding },
    });
};
