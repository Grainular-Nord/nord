/** @format */

import { Builder } from '@repository/builder';
import pkg from './package.json';

await new Builder({
    watch: !!process.env.watch,
    clean: true,
    verbose: true,
})
    .for('browser')
    .from({
        ...pkg,
        cdn: pkg.unpkg,
        entry: './src/index.ts',
    });
