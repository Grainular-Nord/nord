/** @format */

import { ToStringTypes } from '../../types/to-string-types';
// Initialize a DOMParser instance for parsing CSS text into CSSOM
const parser = new DOMParser();

/**
 * Scopes a stylesheet by appending a unique scope identifier to each selector.
 *
 * @param scope - A unique identifier to scope the styles.
 * @param rules - The list of CSS rules to be scoped.
 * @returns An array of scoped CSSRule objects.
 */
const scopeStyleSheet = (scope: string, rules: CSSRuleList) => {
    const ruleList: CSSRule[] = [];

    // Iterate over each rule in the CSSRuleList
    for (const rule in rules) {
        if (rules.hasOwnProperty(rule)) {
            const currentRule = rules[rule];

            // Depending on the type of the rule, process it accordingly
            switch (true) {
                // For standard CSS rules, modify the selector text to include the scope
                case currentRule.constructor.name === 'CSSStyleRule':
                    (currentRule as any).selectorText = `${(currentRule as any).selectorText}[${scope}] `;
                    ruleList.push(currentRule);
                    break;
                // For media rules, process their internal rules recursively
                case currentRule.constructor.name === 'CSSMediaRule':
                    const innerRules = scopeStyleSheet(scope, (currentRule as CSSMediaRule).cssRules);
                    while ((currentRule as CSSMediaRule).cssRules[0]) {
                        (currentRule as CSSMediaRule).deleteRule(0);
                    }
                    innerRules.forEach((rule, idx) => (currentRule as CSSMediaRule).insertRule(rule.cssText, idx));
                    ruleList.push(currentRule);
                    break;
            }
        }
    }

    return ruleList;
};

/**
 * Evaluates component styles, scopes them with a unique identifier, and attaches them to the document.
 *
 * @param componentId - Unique identifier for the component's styles.
 * @returns A function that takes template literals as arguments and processes them as CSS.
 */
export const øEvaluateComponentStyle =
    (componentId: string) =>
    (strings: TemplateStringsArray, ...values: ToStringTypes[]) => {
        // Combine the template literal parts into a single CSS string
        const styleString = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');

        // Create a style element with the component ID as an attribute
        const sheet = document.createElement('style');
        sheet.id = componentId;
        sheet.setAttribute('scoped', 'true');

        // Replace existing style sheet if it exists, or append a new one
        const existingSheet = document.head.querySelector(`style[${componentId}]`);
        if (existingSheet) {
            existingSheet.replaceWith(sheet);
        } else {
            document.head.appendChild(sheet);
        }

        // Parse the style string and scope the styles
        const parsed = parser.parseFromString(`<style>${styleString}</style>`, 'text/html');
        const styles = parsed.querySelector('style');

        // If styles are parsed correctly, scope them and insert into the created style element
        if (styles?.sheet) {
            const rules = scopeStyleSheet(componentId, styles.sheet.cssRules);
            rules.forEach((rule, idx) => sheet.sheet?.insertRule(rule.cssText, idx));
        }
    };
