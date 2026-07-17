import { defineConfig } from '@grainular/aurora';
import { EcosystemPopover } from './src/components/ecosystem-popover';
import './custom.css';

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
            label: 'Rendering',
            children: [
                { path: '/server-rendering', label: 'Server rendering' },
                { path: '/api-reference', label: 'API reference' },
            ],
        },
    ],
    page: {
        language: 'en',
        themeColor: '#0b0c0f',
        head: '<meta name="generator" content="Aurora" />',
    },
    site: {
        url: 'https://nordjs.dev',
        title: 'Nørd',
        description: 'Build apps, not bundles.',
        image: '/og-image.png',
        logo: '/logo-aurora-squircle-o.svg',
        navigation: [
            EcosystemPopover({
                items: [
                    {
                        name: 'Aurora',
                        description: 'Static documentation and content sites with independent interactive islands.',
                        href: 'https://aurora.nordjs.dev',
                    },
                    {
                        name: 'Grains',
                        description: 'Small synchronous reactive primitives for local and shared state.',
                        href: 'https://grains.nordjs.dev',
                    },
                    {
                        name: 'Router',
                        description: 'Client-side routes, navigation, outlets, hooks, and transitions.',
                        href: 'https://router.nordjs.dev',
                    },
                    {
                        name: 'Forms',
                        description: 'Reactive controls, validation, bindings, and error rendering.',
                        href: 'https://forms.nordjs.dev',
                    },
                    {
                        name: 'Resource',
                        description: 'Abortable reactive resources for asynchronous data and dependencies.',
                        href: 'https://resource.nordjs.dev',
                    },
                    {
                        name: 'Silo',
                        description: 'Small stores with readonly state and focused reactive selectors.',
                        href: 'https://silo.nordjs.dev',
                    },
                    {
                        name: 'Styled',
                        description: 'Scoped component styles that stay close to their implementation.',
                        href: 'https://styled.nordjs.dev',
                    },
                    {
                        name: 'Custom Elements',
                        description: 'Expose Nørd components as platform-native custom elements.',
                        href: 'https://elements.nordjs.dev',
                    },
                ],
            }),
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
