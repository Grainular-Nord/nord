import type { TemplateCreatorFn } from '../templates';

export const lefthookYml: TemplateCreatorFn = async ({ additionalDependencies }) => {
    if (!additionalDependencies.flat().find(({ name }) => name.includes('lefthook'))) {
        return [];
    }

    const hasPrettier = additionalDependencies.flat().find(({ name }) => name.includes('prettier'));

    if (!hasPrettier) {
        return ['pre-commit:', '    parallel: true', '    # No linters configured yet'];
    }

    return [
        'pre-commit:',
        '    parallel: true',
        '    commands:',
        '        prettier:',
        '            glob: "*.{js,ts,jsx,tsx,json,md,yml,yaml}"',
        '            # Auto-format and re-add to stage',
        '            run: npx prettier --write {staged_files} --no-errors-on-unmatched',
        '            stage_fixed: true',
    ];
};
