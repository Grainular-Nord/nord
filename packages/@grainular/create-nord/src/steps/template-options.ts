import { confirm, multiselect, select } from '@clack/prompts';
import { styleText } from 'node:util';
import { step } from '../utils/step';

const templates = [
    {
        value: 'browser',
        label: 'Nørd Web',
        hint: 'Modern, module based Nørd application',
    },
    {
        value: 'vite',
        label: 'Nørd Vite',
        hint: 'Modern Vite based Nørd application',
    },
    {
        value: 'vite-ts',
        label: 'Nørd Vite Typescript',
        hint: 'Modern Vite based Nørd application with TypeScript',
    },
] as const;

const features = [
    {
        value: [{ name: '@grainular/router', version: 'latest', dev: false }],
        label: 'Nørd Router',
        hint: 'Client side routing',
    },
    {
        value: [{ name: '@grainular/forms', version: 'latest', dev: false }],
        label: 'Nørd Forms',
        hint: 'Grainular Forms',
    },
    {
        value: [{ name: '@grainular/silo', version: 'latest', dev: false }],
        label: 'Nørd Silo',
        hint: 'Store solution for grains',
    },
    {
        value: [{ name: '@grainular/portal', version: 'latest', dev: false }],
        label: 'Nørd Portal',
        hint: 'Allows portaling Nørd fragments',
    },
    {
        value: [{ name: '@grainular/resource', version: 'latest', dev: false }],
        label: 'Nørd Resource',
        hint: 'Async resource abstraction for grains & Nørd',
    },
    {
        value: [{ name: '@grainular/custom-element', version: 'latest', dev: false }],
        label: 'Nørd Custom Elements',
        hint: 'Create Web-components from Nørd components',
    },
];

const dependencies = [
    {
        value: [{ name: 'prettier', version: '^3.7.4', dev: true }],
        label: 'Prettier',
        hint: 'formatting ⎔ https://prettier.io',
    },
    {
        value: [
            { name: '@tailwindcss/vite', version: '^4.1.18', dev: true },
            { name: 'tailwindcss', version: '^4.1.18', dev: false },
        ],
        label: 'Tailwind CSS',
        hint: 'css design system framework ⎔ https//tailwindcss.com',
    },
    {
        value: [{ name: 'lefthook', version: '^2.0.14', dev: true }],
        label: 'Lefthook',
        hint: 'githooks framework ⎔ https://lefthook.dev',
    },
    // {
    //     value: 'eslint@',
    //     label: 'ESLint',
    //     hint: 'linter ⎔ https://eslint.org',
    // },
    {
        value: [{ name: '@biomejs/biome', version: 'latest', dev: true }],
        label: 'Biome',
        hint: 'Rust based linting & formatting ⎔ https://biomejs.dev',
    },
    {
        value: [{ name: 'oxlint', version: 'latest', dev: true }],
        label: 'Oxlint',
        hint: 'Rust based linting ⎔ https://oxc.rs',
    },
    {
        value: [{ name: 'oxfmt', version: 'latest', dev: true }],
        label: 'Oxfmt',
        hint: 'Rust based formatting ⎔ https://oxc.rs',
    },
];

export const templateOptions = async () => {
    // We check which template type should be
    // created for the user. Depending on the
    // type, different packages will be installed
    let useRolldown = false;
    const additionalDependencies = [];
    const type = await step(() =>
        select({
            maxItems: 1,
            message: 'Select a template to scaffold.',
            options: [
                ...templates.map(({ label, hint, value }) => {
                    return { label, hint, value };
                }),
            ],
        }),
    );

    // If a browser based template is used,
    // no additional dependencies will be available
    // and we return early with the rest of
    // the data as default.
    if (type.includes('browser')) {
        return { type, additionalDependencies: [], useRolldown };
    }

    // If a vite template was selected, we want to
    // check if rolldown-vite should be used.
    if (type.includes('vite')) {
        useRolldown = await step(() =>
            confirm({
                message: 'Use rolldown-vite (Experimental)?',
            }),
        );
    }

    // Features to add to the install
    additionalDependencies.push(
        ...(await step(() =>
            multiselect({
                maxItems: features.length,
                required: false,
                message: `Select companion features to add. ${styleText(['dim', 'gray'], 'use arrow keys / space bar')}`,
                options: [
                    ...features.map(({ label, hint, value }) => {
                        return { label, hint, value };
                    }),
                ],
            }),
        )),
    );

    // Some additional dependencies we can install
    // as well, like tailwind, prettier and the rest.
    additionalDependencies.push(
        ...(await step(() =>
            multiselect({
                maxItems: dependencies.length,
                required: false,
                message: `Select additional dependencies to install. ${styleText(['dim', 'gray'], 'use arrow keys / space bar')}`,
                options: [
                    ...dependencies.map(({ label, hint, value }) => {
                        return { label, hint, value };
                    }),
                ],
            }),
        )),
    );

    return { type, additionalDependencies, useRolldown };
};
