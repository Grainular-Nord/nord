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
});
