import { defineConfig } from '@grainular/aurora';
import './custom.css';
import { EcosystemPopover } from './src/components/ecosystem-popover';

export default defineConfig({
    content: 'docs/**/*.md',
    navigation: [
        {
            label: 'Introduction',
            children: [
                { path: '/', label: 'Overview' },
                { path: '/getting-started', label: 'Getting started' },
            ],
        },
        {
            label: 'Core concepts',
            children: [
                { path: '/templates-and-components', label: 'Templates and components' },
                { path: '/reactivity', label: 'Reactivity and grains' },
                { path: '/lifecycle-and-cleanup', label: 'Lifecycle and cleanup' },
                { path: '/typescript', label: 'TypeScript' },
            ],
        },
        {
            label: 'Directives',
            children: [
                { path: '/directives', label: 'Overview' },
                { path: '/directives/events-and-attributes', label: 'Events and attributes' },
                { path: '/directives/refs-and-lifecycle', label: 'Refs and lifecycle' },
                { path: '/directives/portals', label: 'Portals' },
                { path: '/directives/custom', label: 'Creating directives' },
            ],
        },
        {
            label: 'Control flow',
            children: [
                { path: '/structs', label: 'Overview' },
                { path: '/structs/conditional-rendering', label: 'Conditional rendering' },
                { path: '/structs/lists', label: 'Lists' },
                { path: '/structs/async-rendering', label: 'Async rendering' },
                { path: '/structs/built-ins', label: 'Other built-ins' },
                { path: '/structs/custom', label: 'Creating structs' },
            ],
        },
        {
            label: 'Resources',
            children: [
                { path: '/server-rendering', label: 'Server rendering' },
                { path: '/tooling', label: 'Tooling' },
                { path: '/api-reference', label: 'API reference' },
            ],
        },
    ],
    page: {
        language: 'en',
        themeColor: '#0b0c0f',
        head: '<link rel="icon" type="image/svg+xml" href="/nord-logo.svg" /><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /><link rel="manifest" href="/site.webmanifest" /><meta name="generator" content="Aurora" />',
    },
    site: {
        url: 'https://nordjs.dev',
        title: 'Nørd',
        description: 'Build apps, not bundles.',
        image: '/og-image.png',
        logo: '/nord-logo.svg',
        navigation: [
            EcosystemPopover({
                items: [
                    {
                        name: 'Aurora',
                        description: 'Static documentation and content sites with independent interactive islands.',
                        href: 'https://aurora.nordjs.dev',
                    },
                    {
                        name: 'Router',
                        description: 'Client-side routes, navigation, outlets, hooks, and transitions.',
                        href: 'https://github.com/Grainular-Nord/nord/tree/main/packages/%40grainular/router',
                    },
                    {
                        name: 'Forms',
                        description: 'Reactive controls, validation, bindings, and error rendering.',
                        href: 'https://github.com/Grainular-Nord/nord/tree/main/packages/%40grainular/forms',
                    },
                    {
                        name: 'Resource',
                        description: 'Abortable reactive resources for asynchronous data and dependencies.',
                        href: 'https://github.com/Grainular-Nord/nord/tree/main/packages/%40grainular/resource',
                    },
                    {
                        name: 'Silo',
                        description: 'Small stores with readonly state and focused reactive selectors.',
                        href: 'https://github.com/Grainular-Nord/nord/tree/main/packages/%40grainular/silo',
                    },
                    {
                        name: 'Styled',
                        description: 'Scoped component styles that stay close to their implementation.',
                        href: 'https://github.com/Grainular-Nord/nord/tree/main/packages/%40grainular/styled',
                    },
                    {
                        name: 'Custom Elements',
                        description: 'Expose Nørd components as platform-native custom elements.',
                        href: 'https://github.com/Grainular-Nord/nord/tree/main/packages/%40grainular/custom-elements',
                    },
                ],
            }),
            { text: 'Playground', link: 'https://playground.nordjs.dev' },
            { text: 'Guide', link: '/getting-started' },
            { text: 'API', link: '/api-reference' },
            { text: 'LLMs', link: '/llms' },
        ],
        social: [
            {
                label: 'GitHub repository',
                link: 'https://github.com/grainular-nord/nord',
                icon: 'github',
            },
        ],
        footer: {
            text: 'Released under the MIT License. Copyright © 2023–2026 Sebastian Heinz.',
            navigation: [{ text: 'LLM Documentation', link: '/llms' }],
        },
    },
});
