import { build } from 'bun';

const output = await build({
    entrypoints: ['./src/index.ts'],
    outdir: './bin',
    target: 'node',
    format: 'esm',
    external: [
        // Node built-ins
        'node:fs/promises',
        'node:fs',
        'node:path',
        'node:process',
        'node:util',
        'node:readline',
        'node:tty',
        'node:console',
        'node:child_process',
        // Third-party packages with ESM/CJS mixed internals
        '@clack/core',
        '@clack/prompts',
    ],
});

for (const entry of output.logs) {
    Bun.stdout.write(entry.message);
}
