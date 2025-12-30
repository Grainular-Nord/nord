/** @format */

import { build } from '@repository/builder';
import pkg from './package.json';

await build.for('browser').from({
    ...pkg,
    cdn: pkg.unpkg,
    entry: './src/index.ts',
});
