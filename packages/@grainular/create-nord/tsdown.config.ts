import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    platform: 'node',
    format: ['esm'],
    outDir: 'bin',
    external: [
        // Third-party packages with ESM/CJS mixed internals
        '@clack/core',
        '@clack/prompts',
    ],
    dts: false,
    clean: true,
    sourcemap: false,
    splitting: false,
    treeshake: true,
    minify: false,
});
