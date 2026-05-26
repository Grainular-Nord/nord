import type { ComponentFragment } from '@grainular/nord';
import type { StyleFragment, styleParser } from './style-parser';

// Global style cache for tracking
// stylesheets by parser id.
const cache = new Map<string, CSSStyleSheet>();

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

const scopeStyles = (styleResult: ReturnType<typeof styleParser>) => {
    const { identifier, styles } = styleResult;

    if (!cache.has(identifier)) {
        const sheet = new CSSStyleSheet();
        cache.set(identifier, sheet);
        sheet.replaceSync(styles);
        scopeRule(sheet.cssRules, identifier);
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    }

    return identifier;
};

export const withStyles = (template: () => ComponentFragment, styles: () => StyleFragment): ComponentFragment => {
    const templateResult = template();
    const styleResult = styles();

    return {
        ...templateResult,
        hydrate: (target: Node) => {
            const scope = scopeStyles(styleResult);
            templateResult.hydrate(target, { scope });
        },
    };
};
