import { build } from 'bun';

const output = await build({ entrypoints: ['./src/index.ts'], outdir: './bin', target: 'node' });
for (const entry of output.logs) {
    console.log(entry);
}
