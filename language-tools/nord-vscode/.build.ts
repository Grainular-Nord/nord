/** @format */

import { Builder } from '@repository/builder';
import pkg from "./package.json";

await new Builder({ watch: false, clean: true, verbose: false }).for('node').from({
    ...pkg,
    entry: './src/extension.ts',
    external: ['vscode'],
});
