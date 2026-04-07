/** @format */

import { build } from '@repository/builder';
import pkg from './package.json';

await build.for('node').from({
    ...pkg,
    entry: './src/index.ts',
});
