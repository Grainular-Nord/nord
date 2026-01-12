import type { TemplateCreatorFn } from '../templates';

export const prettierrc: TemplateCreatorFn = async ({ additionalDependencies }) => {
    if (!additionalDependencies.flat().find(({ name }) => name.includes('prettier'))) {
        return [];
    }

    // Otherwise we return a simple prettier config
    // optimized for js/ts and for template strings formatting
    return [
        '{',
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

export const prettierignore: TemplateCreatorFn = async () => {
    return [
        '# Dependencies',
        'node_modules',
        '.pnpm-store',
        '',
        '# Build',
        'dist',
        'dist-ssr',
        'coverage',
        '',
        '# System',
        '.git',
        '.DS_Store',
        '*.log',
    ];
};
