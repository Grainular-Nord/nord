/** @format */

import { build } from '@repository/builder';
import pkg from './package.json';

await build.for('node').from({
    ...pkg,
    entry: './src/index.ts',
});

await build.for('node').from({
    entry: './src/runtime/index.ts',
    main: pkg.exports['./runtime'].require,
    module: pkg.exports['./runtime'].import,
    types: pkg.exports['./runtime'].types,
});
