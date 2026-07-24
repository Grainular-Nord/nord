import { setAttribute } from '../internals/attribute-bindings';
import { isSubscribableValue } from '../internals/is-subscribable-value';
import { unwrap } from '../internals/unwrap';
import { createDirective } from './create-directive';

/**
 * A directive that sets one or more attributes on a DOM element. Accepts a
 * record of attribute names to values. If a value is a `Subscribable`, the
 * attribute is kept in sync with the subscribable's current value and updated
 * whenever it changes.
 *
 * ```ts
 * const color = grain('red');
 *
 * html`<div ${attr({ id: 'my-div', 'data-color': color })}></div>`;
 * ```
 *
 * All subscriptions are cleaned up when the directive is torn down.
 */

/**
 * Creates a directive that binds attributes to a DOM element.
 *
 * @param {Record<PropertyKey, unknown>} dict - A record mapping attribute
 * names to their values. Values may be static or `Subscribable`.
 *
 * @returns {Fragment} A directive that sets the given attributes on the
 * target element and subscribes to any reactive values.
 *
 * @example
 * ```ts
 * const label = grain('hello');
 *
 * html`<button ${attr({ type: 'button', 'aria-label': label })}>Click</button>`;
 * ```
 */

export const attr = (dict: Record<PropertyKey, unknown>) => {
    return createDirective((node) => {
        const subscribers = new Set<(() => void) | void>();

        for (const [key, value] of Object.entries(dict)) {
            setAttribute(node, key, unwrap(value));
            if (isSubscribableValue(value)) {
                const sub = value.subscribe((value) => setAttribute(node, key, value));
                subscribers.add(sub);
            }
        }

        return () => {
            for (const fn of Array.from(subscribers)) {
                fn?.();
            }
        };
    });
};
