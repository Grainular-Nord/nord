import { defineConfig } from '@grainular/aurora';
import './custom.css';

export default defineConfig({
    content: 'docs/*.md',
    navigation: [
        {
            label: 'Overview',
            children: [
                { path: '/getting-started', label: 'Getting started' },
                { path: '/routing', label: 'Routing' },
                { path: '/cli', label: 'CLI and deployment' },
            ],
        },
        {
            label: 'Core concepts',
            children: [
                { path: '/configuration', label: 'Configuration' },
                { path: '/markdown', label: 'Markdown' },
                { path: '/islands', label: 'Components and islands' },
                { path: '/layouts', label: 'Layouts' },
                { path: '/styling', label: 'Styling' },
                { path: '/generated-files', label: 'Generated files' },
            ],
        },
    ],
    components: [
        {
            name: 'LandingHero',
            client: false,
            component: () => import('./src/components/landing-hero'),
        },
        {
            name: 'Counter',
            client: true,
            component: () => import('./src/components/counter'),
            host: { class: 'aurora-demo-island' },
        },
    ],
    layouts: [
        {
            name: 'landing',
            layout: () => import('./src/layouts/landing'),
        },
    ],
    page: {
        language: 'en',
        themeColor: '#090d13',
        head: '<meta name="generator" content="Aurora" />',
    },
    site: {
        url: 'https://aurora.nordjs.dev',
        title: 'Aurora',
        description: 'A Markdown-first static site framework built with Nørd.',
        logo: '/aurora.svg',
        navigation: [
            { text: 'Guide', link: '/getting-started' },
            { text: 'Islands', link: '/islands' },
        ],
        social: [
            {
                label: 'Aurora on GitHub',
                link: 'https://github.com/grainular-nord/nord/tree/main/packages/@grainular/aurora',
                icon: 'github',
            },
        ],
        footer: {
            text: 'Static by default. Reactive where it matters.',
            navigation: [
                { text: 'Nørd', link: 'https://nordjs.dev' },
                { text: 'Get started', link: '/getting-started' },
            ],
        },
    },
});
