import { defineConfig } from 'vitepress';
import llmstxt from 'vitepress-plugin-llms';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    vite: {
        plugins: [llmstxt()],
    },

    title: 'Nørd',
    description: 'Build Apps, not Bundles.',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: '/logo.png',
        nav: [
            { text: 'Getting started', link: '/docs/getting-started' },
            { text: 'Docs', link: '/docs' },
            { text: 'LLMs', link: '/docs/llms' },
            { text: 'Tutorial', link: '/playground/tutorial/01-hello-world' },
            { text: 'Playground', link: '/playground' },
        ],

        sidebar: [
            {
                text: 'Getting Started',
                items: [
                    { text: 'What is Nørd?', link: '/docs/overview' },
                    { text: 'Try out Nørd', link: '/docs/nord-in-the-browser' },
                    {
                        text: 'Installation',
                        items: [
                            { text: 'via CDN', link: '/docs/getting-started' },
                            { text: 'via Package manager', link: '' },
                        ],
                    },
                    { text: 'Hello World', link: '/docs/hello-world' },
                ],
            },
            {
                text: 'Essentials',
                items: [
                    { text: 'Templates', link: 'docs/essentials/templates' },
                    { text: 'Components', link: 'docs/essentials/components' },
                    { text: 'Reactivity', link: 'docs/essentials/reactivity' },
                    { text: 'Control Flow', link: 'docs/essentials/control-flow' },
                    { text: 'Directives', link: 'docs/essentials/directives' },
                ],
            },
            {
                text: 'Grains',
                items: [],
            },
        ],

        socialLinks: [{ icon: 'github', link: 'https://github.com/grainular-nord/nord' }],

        search: {
            provider: 'local',
        },

        editLink: {
            pattern: 'https://github.com/grainular-nord/nord/sites/docs.nord.dev/edit/main/:path',
            text: 'Edit this page on GitHub',
        },

        lastUpdated: {
            text: 'Updated at',
            formatOptions: {
                dateStyle: 'medium',
                timeStyle: 'medium',
            },
        },

        footer: {
            message: 'Released under the MIT License.',
            copyright: `Copyright © 2023 - ${new Date().getFullYear()} Sebastian Heinz`,
        },
    },
    srcExclude: ['readme.md', 'license.md', 'contributing.md'],
    sitemap: {
        hostname: 'https://nordjs.dev',
    },
});
