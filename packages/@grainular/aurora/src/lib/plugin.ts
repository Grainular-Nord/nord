import rehypeShiki from '@shikijs/rehype';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Plugin as VitePlugin } from 'vite';
import { nordMarkdown } from 'vite-plugin-nord-md';
import type { AuroraConfig } from './config';
import { virtualModule } from './virtual-module';

export const plugin = (config: AuroraConfig): VitePlugin[] => {
    const virtualEntryId = 'virtual:aurora-entry';
    const resolvedEntryId = `\0${virtualEntryId}`;
    const resolved = Object.assign({}, config);
    const { content, markdown } = resolved ?? {};

    return [
        // We add our markdown parsing plugin as a
        // primary vite plugin, transforming the markdown
        // into readable typescript files that can be consumed
        // by the aurora app
        nordMarkdown({
            components: [
                {
                    identifier: 'Info',
                    importPath: '@grainular/aurora/runtime',
                },
                ...(markdown?.components ?? []),
            ],
            plugins: [[rehypeShiki, { theme: 'nord' }], ...(markdown?.plugins ?? [])],
            transform: [
                (code) => code.replace(/^:::[\t ]+([a-zA-Z0-9_-]+)/gm, ':::$1'),
                ...(markdown?.transforms ?? []),
            ],
        }),

        // Application Code
        {
            name: 'aurora',
            resolveId: (id) => {
                if (id === virtualEntryId) return resolvedEntryId;
            },
            load: (id) => {
                // Use the resolvedId (with the \0 prefix) for the check
                if (id !== resolvedEntryId) return;

                return `
            import "virtual:aurora.css"
            import { mount } from "@grainular/nord";
            import { App, Page, context } from "@grainular/aurora/runtime";

            // Page content & metadata
            import { meta, content } from "${content}";
            const config = ${JSON.stringify(resolved.site ?? {})}
            context.set(config);

            mount(() => App({ meta, content, config }), { to: document.querySelector('#app') });
        `;
            },
            configureServer(server) {
                server.middlewares.use(virtualModule(server, virtualEntryId));
            },
        },

        // Minimal plugin to handle the virtual inclusion
        // of the main css file.
        // @todo -> later we can allow users to link to their
        // own stylesheets if so desired, making this actually useful
        {
            name: 'aurora-css',
            resolveId: (id) => {
                const [path] = id.split('?');
                if (path !== 'virtual:aurora.css') return;
                return '\0virtual:aurora.css';
            },
            load: async (id) => {
                const [path] = id.split('?');
                if (path !== '\0virtual:aurora.css') return;
                return await readFile(resolve(__dirname, '../runtime/app.css'), 'utf-8');
            },
        },
    ];
};
