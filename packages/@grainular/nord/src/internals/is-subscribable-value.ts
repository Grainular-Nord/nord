import type { Subscribable } from './subscribable';

export const isSubscribableValue = (value: unknown): value is Subscribable => {
    return value !== null && typeof value === 'function' && 'subscribe' in value;
};
