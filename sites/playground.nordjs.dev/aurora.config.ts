import { defineConfig } from '@grainular/aurora';
import analytics from './analytics.txt' with { type: 'text' };
import './custom.css';

// Aurora also evaluates this config module client-side (client-entry.ts
// reads `config.components`/`config.layouts` at runtime), so anything at
// module scope has to be browser-safe — no `node:url`/`node:path`, plain
// `URL` only.
const workspacePackage = (path: string) => new URL(`../../packages/${path}`, import.meta.url).pathname;

export default defineConfig({
    content: 'lessons/**/*.md',
    layouts: [
        { name: 'lesson', layout: () => import('./src/layouts/lesson') },
        { name: 'playground', layout: () => import('./src/layouts/playground') },
    ],
    components: [
        {
            name: 'CodeEditor',
            client: true,
            component: () => import('./src/components/code-editor'),
            host: { class: 'lesson-editor-host' },
        },
        {
            name: 'WorkspaceControls',
            client: true,
            component: () => import('./src/components/workspace-controls'),
            host: { class: 'lesson-workspace-controls-host' },
        },
    ],
    page: {
        language: 'en',
        themeColor: '#0b0c0f',
        head: '<link rel="icon" type="image/svg+xml" href="/nord-logo.svg" /><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" /><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /><link rel="manifest" href="/site.webmanifest" /><meta name="generator" content="Aurora" />',
    },
    site: {
        url: 'https://playground.nordjs.dev',
        title: 'Nørd Playground',
        description: 'Learn Nørd by editing a real, running project.',
        logo: '/nord-logo.svg',
        navigation: [
            { text: 'Playground', link: '/' },
            { text: 'Tutorial', link: '/01-hello-nord' },
            { text: 'Guide', link: 'https://docs.nordjs.dev/getting-started' },
            { text: 'API', link: 'https://docs.nordjs.dev/api-reference' },
            { text: 'LLMs', link: 'https://docs.nordjs.dev/llms' },
        ],
        social: [{ label: 'GitHub repository', link: 'https://github.com/grainular-nord/nord', icon: 'github' }],
        footer: false,
    },
    llms: false,
    // @grainular/nord and @grainular/grains are singletons internally (the
    // lifecycle observer that backs `mounted()` lives at module scope). This
    // site's own node_modules symlink for them resolves through bun's
    // install store, a separate file from the one Aurora's runtime imports
    // via an absolute path straight into packages/@grainular/*  — so without
    // aliasing them to that exact same file, this site ends up with two
    // independent copies of the singleton, and directives registered through
    // one never get processed because only the other's observer is ever
    // started. The alias forces both to resolve to one shared instance.
    vite: {
        resolve: {
            alias: {
                '@grainular/codemirror/theme.css': workspacePackage('@grainular/codemirror/src/styles/theme.css'),
                '@grainular/codemirror': workspacePackage('@grainular/codemirror/src/index.ts'),
            },
        },
        optimizeDeps: {
            exclude: ['@grainular/nord', '@grainular/grains'],
            include: [
                'prettier/standalone',
                'prettier/plugins/estree',
                'prettier/plugins/html',
                'prettier/plugins/typescript',
            ],
        },
        plugins: [
            {
                name: 'analytics',
                apply: 'build',
                enforce: 'post',
                generateBundle(_options, bundle) {
                    if (process.env.VITE_ANALYTICS !== 'true') return;

                    const key = process.env.VITE_ANALYTICS_AURORA_KEY;
                    const endpoint = process.env.VITE_ANALYTICS_ENDPOINT;
                    if (!key || !endpoint) return;

                    const script = `<script data-site="${key}" data-endpoint="${endpoint}">${analytics}</script>`;

                    for (const asset of Object.values(bundle)) {
                        if (asset.type !== 'asset' || !asset.fileName.endsWith('.html')) continue;
                        if (typeof asset.source !== 'string') continue;

                        asset.source = asset.source.replace('</head>', `${script}\n</head>`);
                    }
                },
            },
        ],
    },
});
