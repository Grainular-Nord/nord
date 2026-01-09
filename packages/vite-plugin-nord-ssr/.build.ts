/** @format */

import { build } from '@repository/builder';
import pkg from './package.json';

await build.for('node').from({
    ...pkg,
    entry: './index.ts',
});
