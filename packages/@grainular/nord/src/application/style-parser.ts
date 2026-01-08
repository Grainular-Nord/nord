import { identifier } from '../internals/identifier';

export type StyleFragment = {
    id: string;
    attach: () => void;
};

const styleCache = new Map<string, CSSStyleSheet>();

export const styleParser = (str: TemplateStringsArray, ...fragments: (string | number)[]): StyleFragment => {
    const id = identifier();
    const style = str.reduce((current, element, idx) => `${current}${element}${fragments[idx] ?? ''}`, '');

    const scopeRule = (rules: CSSRuleList | null) => {
        for (const rule of rules ?? []) {
            if (rule instanceof CSSStyleRule) {
                rule.selectorText = `${rule.selectorText}[${id}]`;
                scopeRule(rule.cssRules);
            }

            if (rule instanceof CSSMediaRule) {
                scopeRule(rule.cssRules);
            }
        }
    };

    return {
        id,
        attach: () => {
            if (!styleCache.has(id)) {
                const sheet = new CSSStyleSheet();
                styleCache.set(id, sheet);
                sheet.replaceSync(style);
                scopeRule(sheet.cssRules);
                document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
            }
        },
    };
};
