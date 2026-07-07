import type { Subscribable } from '../application/subscribable';
import { isSubscribableValue } from './is-subscribable-value';

export const unwrap = <T>(value: T | Subscribable<T>): T => {
    return isSubscribableValue(value) ? value() : value;
};
