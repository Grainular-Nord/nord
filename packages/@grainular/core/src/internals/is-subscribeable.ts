/** @format */

import type { Subscribable } from '../component/template-parser'

export const isSubscribable = (value: unknown): value is Subscribable => {
    return value !== null && (typeof value === 'object' || typeof value === 'function') && 'subscribe' in value
}
