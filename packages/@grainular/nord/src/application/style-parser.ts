import { identifier } from '../internals/identifier';

export type StyleFragment = {
    id: string;
    hydrate: () => void;
};

const styleCache = new Map<string, CSSStyleSheet>();

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

export const styleParser = (str: TemplateStringsArray, ...fragments: (string | number)[]): StyleFragment => {
    const scope = identifier();
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
