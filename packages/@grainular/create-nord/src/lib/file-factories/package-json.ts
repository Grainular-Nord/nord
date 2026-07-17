import type { TemplateCreatorFn } from '../templates';

export const packageJson: TemplateCreatorFn = async ({ additionalDependencies, name, useRolldown, type }) => {
    const dependencies = new Map<string, string>();
    const devDependencies = new Map<string, string>();
    const overrides = new Map<string, string>();

    // Set vite as dependency
    dependencies.set('vite', 'latest');
    dependencies.set('@grainular/nord', 'latest');
    dependencies.set('@grainular/grains', 'latest');

    // Set ts as dependencies
    if (type.includes('ts')) {
        devDependencies.set('typescript', '^5.9.3');
    }

    if (useRolldown) {
        dependencies.set('vite', 'npm:rolldown-vite@7.2.5');
        overrides.set('vite', 'npm:rolldown-vite@7.2.5');
    }

    for (const { name, version, dev } of additionalDependencies.flat()) {
        dev ? devDependencies.set(name, version) : dependencies.set(name, version);
    }

    return [
        '{',
        `   "name": "${name}",`,
        '   "type": "module",',
        '   "scripts": {',
        '       "dev": "vite dev",',
        '       "build": "vite build",',
        '       "preview": "vite preview"',
        '   },',
        '   "dependencies": {',
        ...[...dependencies.entries()].map(([key, value], idx, arr) => {
            return `        "${key}": "${value}"${idx < arr.length - 1 ? ',' : ''}`;
        }),
        '   },',
        ...(overrides.size
            ? [
                  '   "overrides": {',
                  ...[...overrides.entries()].map(([key, value], idx, arr) => {
                      return `        "${key}": "${value}"${idx < arr.length - 1 ? ',' : ''}`;
                  }),
                  '   },',
              ]
            : []),
        '   "devDependencies": {',
        ...[...devDependencies.entries()].map(([key, value], idx, arr) => {
            return `        "${key}": "${value}"${idx < arr.length - 1 ? ',' : ''}`;
        }),
        '   }',
        '}',
    ];
};
