import rehypeShiki from '@shikijs/rehype';
import { defineConfig } from 'vite';
import { nordMarkdown } from 'vite-plugin-nord-md';

export default defineConfig({
    plugins: [
        nordMarkdown({
            plugins: [[rehypeShiki, { theme: 'nord' }]],
            components: [{ identifier: 'Tip', importPath: '/src/tip' }],
        }),
    ],
});
