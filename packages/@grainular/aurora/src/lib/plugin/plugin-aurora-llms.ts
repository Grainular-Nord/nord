import type { Plugin } from 'vite';
import type { ResolvedAuroraConfig } from '../config/resolve-config';
import { createLlmsFull } from '../llms/create-llms-full';
import { createLlmsIndex } from '../llms/create-llms-index';
import { loadLlmsPages } from '../llms/load-llms-pages';

const LLMS_INDEX = 'llms.txt';
const LLMS_FULL = 'llms-full.txt';

export const pluginAuroraLlms = (config: ResolvedAuroraConfig): Plugin => {
    let base = '/';

    return {
        name: 'aurora-llms',
        configResolved(vite) {
            base = vite.base;
        },
        async generateBundle() {
            const pages = await loadLlmsPages(config);
            this.emitFile({ type: 'asset', fileName: LLMS_INDEX, source: createLlmsIndex(config, pages, base) });
            this.emitFile({ type: 'asset', fileName: LLMS_FULL, source: createLlmsFull(config, pages) });
        },
    };
};
