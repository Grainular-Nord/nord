import type { TemplateCreatorFn } from '../templates';

export const oxfmtrc: TemplateCreatorFn = async ({ additionalDependencies }) => {
    if (!additionalDependencies.flat().find(({ name }) => name.includes('oxfmt'))) {
        return [];
    }

    // Otherwise we return a simple prettier config
    // optimized for js/ts and for template strings formatting
    return [
        '{',
        '   "$schema": "./node_modules/oxfmt/configuration_schema.json",',
        '   "semi": true,',
        '   "singleQuote": true,',
        '   "tabWidth": 4,',
        '   "trailingComma": "all",',
        '   "printWidth": 100,',
        '   "arrowParens": "always",',
        '   "embeddedLanguageFormatting": "auto"',
        '}',
    ];
};
