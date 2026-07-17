import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { createLlmsFull } from '../llms/create-llms-full';
import { createLlmsIndex } from '../llms/create-llms-index';
import { loadLlmsPages } from '../llms/load-llms-pages';

const LLMS_INDEX = 'llms.txt';
const LLMS_FULL = 'llms-full.txt';
const utf8 = (source: string) => new TextEncoder().encode(`\uFEFF${source}`);

export const pluginAuroraLlms = (config: ResolvedAuroraConfig): Plugin => {
    let base = '/';
    let assets: [string, string][] = [];

    return {
        name: 'aurora-llms',
        configResolved(vite) {
            base = vite.base;
        },
        async generateBundle() {
            const pages = await loadLlmsPages(config);
            assets = [
                [LLMS_INDEX, createLlmsIndex(config, pages, base)],
                [LLMS_FULL, createLlmsFull(config, pages)],
            ];

            for (const [fileName, source] of assets) this.emitFile({ type: 'asset', fileName, source });
        },
        async writeBundle(options) {
            await Promise.all(
                assets.map(([fileName, source]) => writeFile(resolve(options.dir!, fileName), utf8(source))),
            );
        },
    };
};
