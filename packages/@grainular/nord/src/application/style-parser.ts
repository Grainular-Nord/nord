import { createIdentifier } from '../internals/identifier';

let counter = 0;
export type StyleFragment = {
    id: string;
    hydrate: () => void;
};

// Global style cache for tracking
// stylesheets by parser id.
const styleCache = new Map<string, CSSStyleSheet>();

// Method to recursively scope rules by appending
// an id to a selector text
const scopeRule = (rules: CSSRuleList | null, id: string) => {
    for (const rule of rules ?? []) {
        if (rule instanceof CSSStyleRule) {
            rule.selectorText = `${rule.selectorText}[${id}]`;
        }

        if ('cssRules' in rule && rule.cssRules instanceof CSSRuleList) {
            scopeRule(rule.cssRules, id);
        }
    }
};

/**
 * Creates a reusable, scoped style fragment from a template literal.
 *
 * Each fragment has a unique identifier and can be applied to the document
 * by calling `hydrate()`. Styles are automatically scoped to prevent
 * collisions with other components.
 *
 * Example usage:
 * ```ts
 * const buttonStyle = css`
 *   .button {
 *     background: red;
 *   }
 * `;
 *
 * // Apply the style to the page
 * export const Button = withScopedStyles(
 *      () => html`<button class=".button"></button>`,
 *      buttonStyle
 * )
 * ```
 *
 * @param str - The template literal parts of the CSS.
 * @param fragments - Interpolated values inside the template.
 * @returns A `StyleFragment` with a unique `id` and a `hydrate()` function.
 */
export const styleParser = (str: TemplateStringsArray, ...fragments: (string | number | boolean)[]): StyleFragment => {
    const scope = createIdentifier(counter++);
    const style = str.reduce((current, element, idx) => `${current}${element}${fragments[idx] ?? ''}`, '');

    return {
        id: scope,
        hydrate: () => {
            if (!styleCache.has(scope)) {
                const sheet = new CSSStyleSheet();
                styleCache.set(scope, sheet);
                sheet.replaceSync(style);
                scopeRule(sheet.cssRules, scope);
                document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
            }
        },
    };
};
