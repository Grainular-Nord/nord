#!/usr/bin/env node

import { parseArguments } from './arguments';
import { runCommand } from './run-command';

const main = async () => runCommand(parseArguments(process.argv.slice(2)));

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
