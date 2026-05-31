import { defineConfig } from 'tsup';

export default defineConfig([
    // ESM bundle
    {
        entry: ['src/index.ts'],
        format: ['esm'],
        outDir: 'dist/esm',
        dts: false,
        clean: false,
        sourcemap: true,
        splitting: false,
        treeshake: true,
        minify: true,
    },
    // CJS bundle
    {
        entry: ['src/index.ts'],
        format: ['cjs'],
        outDir: 'dist/cjs',
        dts: false,
        clean: false,
        sourcemap: true,
        splitting: false,
        treeshake: true,
        minify: true,
    },
    // IIFE browser bundle
    {
        entry: ['src/index.ts'],
        format: ['iife'],
        outDir: 'dist/browser',
        globalName: 'Nord',
        dts: false,
        clean: false,
        sourcemap: true,
        splitting: false,
        minify: true,
        treeshake: true,
    },
    // Types only
    {
        entry: ['src/index.ts'],
        outDir: 'dist/types',
        dts: { only: true },
        clean: false,
    },
]);
