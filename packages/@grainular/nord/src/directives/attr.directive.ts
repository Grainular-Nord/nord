import { isSubscribableValue } from '../internals/is-subscribable-value';
import { createDirective } from './create-directive';

export const attr = (setup: Record<PropertyKey, unknown>) => {
    return createDirective((node) => {
        const subscribers = new Set<(() => void) | void>();

        for (const [key, value] of Object.entries(setup)) {
            node.setAttribute(key, String(value));
            if (isSubscribableValue(value)) {
                subscribers.add(
                    value.subscribe((value) => {
                        node.setAttribute(key, String(value));
                    }),
                );
            }
        }

        return () => {
            for (const fn of subscribers) {
                fn?.();
            }
        };
    });
};
