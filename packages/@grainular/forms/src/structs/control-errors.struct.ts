import { type Grain, combined, derived } from '@grainular/grains';
import { $if, type ComponentFragment } from '@grainular/nord';
import type { Control } from '../lib/control';

type ErrorRenderer = (errors: Grain<string>) => ComponentFragment;
type ControlErrorOptions = {
    showOn?: 'touched' | 'always';
};

export const $controlErrors = <V>(
    control: Control<V>,
    renderer: ErrorRenderer,
    options: ControlErrorOptions = { showOn: 'touched' },
) => {
    // We create a derived state that only emits errors when the conditions are met.
    // Otherwise, it emits null, which causes $if to unmount the view.
    const visibleErrors = derived(combined([control.errors, control.touched]), ([errors, touched]) => {
        // 1. If there are no errors, render nothing
        if (!errors || errors.length === 0) {
            return null;
        }

        // 2. Check visibility conditions
        const shouldShow = options.showOn === 'always' || touched;

        // 3. Return errors if visible, otherwise null
        return shouldShow ? errors : null;
    });

    // Delegate to the existing $if structural directive
    return $if(
        derived(visibleErrors, (value) => (value ?? []).length > 0),
        () => renderer(derived(visibleErrors, (errors) => (errors ?? []).join(', '))),
    );
};
