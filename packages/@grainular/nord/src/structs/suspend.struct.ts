import type { Fragment } from '../internals/fragment';
import { $await } from './await.struct';

/**
 * `$suspend` is a convenience wrapper around `$await` for components that may
 * load asynchronously. Unlike `$await`, it requires both a `pending` and an
 * `error` state, making it the preferred struct for async component boundaries
 * where both loading and error states must always be handled.
 *
 * ```ts
 * html`${$suspend(
 *     () => import('./heavy-component').then(m => m.HeavyComponent()),
 *     {
 *         pending: () => html`<p>Loading...</p>`,
 *         error: (err) => html`<p>Failed: ${err}</p>`,
 *     },
 * )}`;
 * ```
 */

/**
 * Creates a struct that renders an async component with required pending and
 * error states.
 *
 * @param {() => Promise<Fragment> | Fragment} component - A
 * function returning the fragment to render, either synchronously or
 * as a promise.
 * @param {object} options - Required fallback states.
 * @param {() => Fragment} options.pending - Rendered while the
 * component is resolving.
 * @param {(err: Error | string | null) => Fragment} options.error -
 * Rendered if the component rejects.
 *
 * @returns {Fragment} A struct fragment that renders the resolved component,
 * falling back to `pending` or `error` as appropriate.
 *
 * @example
 * ```ts
 * html`${$suspend(
 *     () => import('./heavy-component').then(m => m.HeavyComponent()),
 *     {
 *         pending: () => html`<p>Loading...</p>`,
 *         error: (err) => html`<p>Failed: ${err}</p>`,
 *     },
 * )}`;
 * ```
 */

export const $suspend = (
    component: () => Promise<Fragment> | Fragment,
    { pending, error }: { pending: () => Fragment; error: (err: Error | string | null) => Fragment },
) => {
    return $await(component())
        .$then((fragment) => fragment)
        .$catch(error)
        .$pending(pending);
};
