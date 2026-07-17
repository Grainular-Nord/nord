import { defineConfig } from 'tsup';

export default defineConfig([
    // ESM bundle
    {
        entry: ['src/index.ts'],
        platform: 'node',
        format: ['esm'],
        outDir: 'dist/esm',
        dts: false,
        clean: true,
        sourcemap: true,
        splitting: false,
        treeshake: true,
        minify: false,
    },
    // CJS bundle
    {
        entry: ['src/index.ts'],
        platform: 'node',
        format: ['cjs'],
        outDir: 'dist/cjs',
        dts: false,
        clean: false,
        sourcemap: true,
        splitting: false,
        treeshake: true,
        minify: false,
    },
    // Types only
    {
        entry: ['src/index.ts'],
        outDir: 'dist/types',
        dts: { only: true },
        clean: false,
    },
]);
