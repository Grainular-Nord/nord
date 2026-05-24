import { createStruct } from './create-struct';

/**
 * `$unsafeHtml` is a struct for injecting a raw HTML string directly into
 * the DOM, bypassing Nord's template parser and hydration system entirely.
 *
 * ```ts
 * html`${$unsafeHtml('<p>Raw <strong>HTML</strong></p>')}`;
 * ```
 *
 * > **Warning:** This struct does not sanitize its input. Never pass
 * > user-provided or untrusted strings to `$unsafeHtml` — doing so exposes
 * > your application to XSS attacks. Only use with strings you fully control.
 */

/**
 * Creates a struct that injects a raw HTML string into the DOM.
 *
 * @param {string} trustedHtml - A trusted HTML string to inject. Must not
 * contain user-provided or unsanitized content.
 *
 * @returns {Fragment} A struct fragment that renders the raw HTML string
 * directly into the DOM via a `<template>` element.
 *
 * @example
 * ```ts
 * const markup = '<p>Raw <strong>HTML</strong></p>';
 *
 * html`${$unsafeHtml(markup)}`;
 * ```
 */
export const $unsafeHtml = (trustedHtml: string) => {
    return createStruct(
        (root) => {
            const template = document.createElement('template');
            template.innerHTML = trustedHtml;
            root.replaceWith(template.content);
        },
        () => trustedHtml,
    );
};
