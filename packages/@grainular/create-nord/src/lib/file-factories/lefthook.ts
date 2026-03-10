import type { TemplateCreatorFn } from '../templates';

export const lefthookYml: TemplateCreatorFn = async ({ additionalDependencies }) => {
    if (!additionalDependencies.flat().find(({ name }) => name.includes('lefthook'))) {
        return [];
    }

    const commandKeys = ['oxfmt', 'oxlint', 'prettier', 'biomejs'];
    const commandDependencies = additionalDependencies.flat().filter(({ name }) => commandKeys.includes(name));

    const content = ['pre-commit:', '    parallel: true'];

    if (!commandDependencies.length) {
        content.push('    # No commands configured yet');
        return content;
    }

    content.push('    commands:');

    if (commandDependencies.find(({ name }) => name === 'prettier')) {
        content.push(
            ...[
                '        prettier:',
                '            glob: "*.{js,ts,json,md,yml,yaml}"',
                '            # Auto-format and re-add to stage',
                '            run: npx prettier --write {staged_files} --no-errors-on-unmatched',
                '            stage_fixed: true',
            ],
        );
    }

    return content;
};
