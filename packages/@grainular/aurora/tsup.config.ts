import { defineConfig } from 'tsup';

const entry = {
    index: 'src/index.ts',
    'runtime/index': 'src/runtime/index.ts',
    'cli/index': 'src/cli/index.ts',
};

const external = [
    'vite',
    '@shikijs/rehype',
    'shiki/core',
    'vite-plugin-nord-md',
    '@grainular/nord',
    '@grainular/grains',
];

export default defineConfig([
    // ESM bundle
    {
        entry,
        platform: 'node',
        format: ['esm'],
        outDir: 'dist/esm',
        external,
        loader: { '.css': 'text' },
        dts: false,
        clean: true,
        sourcemap: true,
        splitting: false,
        treeshake: true,
        minify: false,
    },
    // CJS bundle
    {
        entry,
        platform: 'node',
        format: ['cjs'],
        outDir: 'dist/cjs',
        external,
        loader: { '.css': 'text' },
        dts: false,
        clean: false,
        sourcemap: true,
        splitting: false,
        treeshake: true,
        minify: false,
    },
    // Types only
    {
        entry,
        outDir: 'dist/types',
        dts: { only: true },
        clean: false,
    },
]);
