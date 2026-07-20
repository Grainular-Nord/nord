import { type FSWatcher, watch } from 'node:fs';
import { resolve } from 'node:path';
import { build, createServer, preview, type ViteDevServer } from 'vite';
import { createViteConfig } from '../lib/config/create-vite-config';
import { loadConfig } from '../lib/config/load-config';
import type { CliArguments } from './arguments';

const runBuild = async (arguments_: CliArguments) => {
    const config = await loadConfig(resolve(arguments_.root));
    await build(createViteConfig(config, { mode: arguments_.mode }));
};

const runPreview = async (arguments_: CliArguments) => {
    const config = await loadConfig(resolve(arguments_.root));
    const server = await preview(
        createViteConfig(config, {
            mode: arguments_.mode,
            preview: { host: arguments_.host, open: arguments_.open, port: arguments_.port },
        }),
    );
    server.printUrls();
};

const runDev = async (arguments_: CliArguments) => {
    const root = resolve(arguments_.root);
    let server: ViteDevServer | undefined;
    let watcher: FSWatcher | undefined;
    let restarting = false;

    const start = async () => {
        const config = await loadConfig(root);
        server = await createServer(
            createViteConfig(config, {
                mode: arguments_.mode,
                server: { host: arguments_.host, open: arguments_.open, port: arguments_.port },
            }),
        );
        await server.listen();
        server.printUrls();

        watcher?.close();
        if (config.configFile) {
            watcher = watch(config.configFile, async () => {
                if (restarting) return;
                restarting = true;
                try {
                    await server?.close();
                    await start();
                } catch (error) {
                    console.error(error);
                } finally {
                    restarting = false;
                }
            });
        }
    };

    await start();
};

export const runCommand = async (arguments_: CliArguments) => {
    if (arguments_.command === 'build') return runBuild(arguments_);
    if (arguments_.command === 'preview') return runPreview(arguments_);
    return runDev(arguments_);
};
