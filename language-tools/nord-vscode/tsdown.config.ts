import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/extension.ts'],
    platform: 'node',
    format: ['cjs'],
    outDir: 'dist',
    external: ['vscode'],
    dts: false,
    clean: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    minify: false,
});
