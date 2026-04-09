import { FRAGMENT_ID, type Fragment } from '../internals/fragment';
import { createIdentifier } from '../internals/identifier';
import { IS_COMPONENT, type StylableFragment } from './component-fragment';
import { hydrateComponentTemplate } from './hydrate-component-template';

// Global style cache for tracking
// stylesheets by parser id.
const styleCache = new Map<string, CSSStyleSheet>();
let styleSheetIdentifier = 0;

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

const templateCache = new Map<string, HTMLTemplateElement>();
const getTemplate = (html: string) => {
    const template = templateCache.get(html);
    if (template && template.ownerDocument === document) {
        return template;
    }

    const created = document.createElement('template');
    created.innerHTML = html.trim();
    templateCache.set(html, created);
    return created;
};

export const createComponentFragment = (template: string[], fragments: Fragment[]): StylableFragment => {
    const html = template.join('');
    const fragmentId = createIdentifier();
    const styleId = createIdentifier();

    const hydrateNode = (node: Node, scope?: string) => {
        // Bail early if we have a hydration mismatch here
        if (!(node instanceof Comment)) return;

        // Retrieve the template, by either creating or
        // cloning it
        const template = getTemplate(html).content.cloneNode(true);

        // Hydrate the component template using the fragment,
        // the available fragments and scope the nodes if required
        for (const { fragment, args } of hydrateComponentTemplate(template, fragments, scope)) {
            fragment.hydrate(...args);
        }

        node.replaceWith(template);
    };

    const fragment = {
        [FRAGMENT_ID]: fragmentId,
        [IS_COMPONENT]: true as const,
        resolve: () => `<!--${fragmentId.get()}-->`,
        render: () => {
            return template
                .filter((_, i) => i % 2 === 0) // Keep even indices (Strings only)
                .flatMap((str, idx) => [str, fragments[idx]?.render() ?? ''])
                .join('');
        },
        hydrate: (node: Node) => {
            hydrateNode(node);
        },
    };

    return {
        ...fragment,
        css: (str: TemplateStringsArray, ...fragments: (string | number | boolean)[]) => {
            const style = str.reduce((current, element, idx) => `${current}${element}${fragments[idx] ?? ''}`, '');
            styleId.create(String(++styleSheetIdentifier));
            return {
                ...fragment,
                hydrate: (node: Node) => {
                    if (!styleCache.has(styleId.get())) {
                        const sheet = new CSSStyleSheet();
                        styleCache.set(styleId.get(), sheet);
                        sheet.replaceSync(style);
                        scopeRule(sheet.cssRules, styleId.get());
                        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
                    }

                    hydrateNode(node, styleId.get());
                },
            };
        },
    };
};
