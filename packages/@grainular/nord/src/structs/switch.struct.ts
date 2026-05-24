import { disconnectNodes } from '../application/lifecycle-observer';
import type { Subscribable } from '../application/subscribable';
import type { ComponentFragment } from '../component/component-fragment';
import type { Fragment } from '../internals/fragment';
import { hydrateFragment } from '../internals/hydrate-fragment';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import { createStruct } from './create-struct';

/**
 * `$switch` is a struct for rendering one of several templates based on the
 * current value of a condition. It works similarly to a JavaScript `switch`
 * statement, with `.$case` for specific values and `.$default` as the
 * fallback.
 *
 * ```ts
 * const tab = grain<'home' | 'profile' | 'settings'>('home');
 *
 * html`${$switch(tab)
 *     .$case('home', () => html`<p>Home</p>`)
 *     .$case('profile', () => html`<p>Profile</p>`)
 *     .$default(() => html`<p>Settings</p>`)
 * }`;
 * ```
 *
 * If the source is a `Subscribable`, the rendered template updates reactively
 * whenever the value changes. If no case matches and no `$default` is provided,
 * nothing is rendered.
 */

/**
 * Describes the chainable return type of `$switch` and `.$case`.
 * Each `.$case` call returns a new `SwitchStruct` allowing further cases to
 * be chained. `.$default` terminates the chain and returns the struct fragment.
 */
type CaseFn<T> = (value: T, render: () => ComponentFragment) => SwitchStruct<T>;
type SwitchStruct<T> = {
    /**
     * Adds a case to the switch. If the condition matches `value`, the
     * provided template is rendered. Multiple cases can be chained.
     *
     * @param {T} value - The value to match against the condition.
     * @param {() => ComponentFragment} render - The template to render on match.
     */
    $case: CaseFn<T>;

    /**
     * Specifies the fallback template rendered when no case matches.
     * Terminates the chain and returns the struct fragment.
     *
     * @param {() => ComponentFragment} render - The fallback template.
     *
     * @returns {Fragment} The struct fragment ready to use in a template.
     */
    $default: (render: () => ComponentFragment) => Fragment;
};

/**
 * Creates a struct that renders a template based on matching the current
 * value of a condition against a set of cases.
 *
 * @template T - The type of the condition value.
 *
 * @param {Subscribable<T> | (() => T)} condition - A subscribable or getter
 * providing the value to match. If subscribable, the rendered template updates
 * reactively whenever the value changes.
 *
 * @returns {SwitchStruct<T>} A chainable object for defining cases and a
 * default fallback. Chain `.$case` for each value to handle, and `.$default`
 * to specify the fallback.
 *
 * @example
 * ```ts
 * const tab = grain<'home' | 'profile' | 'settings'>('home');
 *
 * html`${$switch(tab)
 *     .$case('home', () => html`<p>Home</p>`)
 *     .$case('profile', () => html`<p>Profile</p>`)
 *     .$default(() => html`<p>Settings</p>`)
 * }`;
 * ```
 */
export const $switch = <T>(condition: Subscribable<T> | (() => T)): SwitchStruct<T> => {
    let defaultFragment: () => ComponentFragment;
    const current = new Set<Element>();
    const cases = new Map<T, () => ComponentFragment>();

    const struct = createStruct(
        (node) => {
            const render = (value: T) => {
                // Get the initial fragment and clear the current
                // set and nodes, so that all unmount run correctly
                const fragment = cases.get(value) ?? defaultFragment;
                disconnectNodes([...current.values()]);
                current.clear();

                // Hydrate the nodes, assign them to the nodes
                // set, and render them to the current anchor
                const nodes = hydrateFragment(fragment());
                node.before(...nodes);
                for (const node of nodes) current.add(node);
            };

            render(condition());

            if (isSubscribableValue(condition)) {
                const cleanup = condition.subscribe((value) => {
                    render(value);
                });

                return () => {
                    current.clear();
                    cleanup?.();
                };
            }
        },
        () => {
            const fragment = cases.get(condition()) ?? defaultFragment;
            return fragment().render();
        },
    );

    // Compose the elements for the respective return way

    const $default = (render: () => ComponentFragment) => {
        defaultFragment = render;
        return struct;
    };

    const $case: CaseFn<T> = (value: T, render: () => ComponentFragment) => {
        cases.set(value, render);
        return {
            $case,
            $default,
        };
    };

    return { $case, $default };
};
