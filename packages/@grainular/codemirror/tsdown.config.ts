import { defineConfig } from 'tsdown';

export default defineConfig([
    {
        entry: { index: 'src/index.ts', theme: 'src/styles/theme.css' },
        format: ['esm'],
        outDir: 'dist/esm',
        dts: false,
        clean: true,
        sourcemap: true,
        splitting: true,
        treeshake: true,
    },
    {
        entry: ['src/index.ts'],
        format: ['cjs'],
        outDir: 'dist/cjs',
        dts: false,
        clean: false,
        sourcemap: true,
        splitting: false,
        treeshake: true,
    },
    {
        entry: ['src/index.ts'],
        outDir: 'dist/types',
        dts: { only: true },
        clean: false,
    },
]);
