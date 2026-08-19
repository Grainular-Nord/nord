import { build, dev, preview } from '../index';
import type { CliArguments } from './arguments';

export const runCommand = async (arguments_: CliArguments) => {
    const { command, ...options } = arguments_;

    if (command === 'build') return build(options);
    if (command === 'preview') {
        const server = await preview(options);
        server.printUrls();
        return server;
    }

    return dev({ ...options, onServerStart: (server) => server.printUrls() });
};
