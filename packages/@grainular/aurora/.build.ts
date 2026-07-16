/** @format */

import { Builder } from '@repository/builder';
import pkg from './package.json';

const build = new Builder({
    watch: process.argv.includes('--watch'),
    clean: true,
    verbose: false,
});

await build.for('node').from({
    ...pkg,
    entry: './src/index.ts',
    external: ['vite', '@shikijs/rehype', 'vite-plugin-nord-md', 'shiki/core'],
});

await build.for('node').from({
    entry: './src/runtime/index.ts',
    main: pkg.exports['./runtime'].require,
    module: pkg.exports['./runtime'].import,
    // Declaration emit preserves the entry's path below `src`, so emitting
    // from the shared types root produces `runtime/index.d.ts`.
    types: pkg.types,
    external: ['@grainular/nord', '@grainular/grains'],
});

await build.for('node').from({
    entry: './src/cli/index.ts',
    main: './dist/cjs/cli/index.js',
    module: pkg.bin.aurora,
    types: pkg.types,
    external: ['vite', '@shikijs/rehype', 'vite-plugin-nord-md'],
});
