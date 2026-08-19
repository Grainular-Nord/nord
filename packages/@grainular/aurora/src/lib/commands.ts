import { type FSWatcher, watch } from 'node:fs';
import { resolve } from 'node:path';
import {
    build as viteBuild,
    createServer,
    preview as vitePreview,
    type PreviewServer,
    type ServerOptions,
    type ViteDevServer,
} from 'vite';
import { createViteConfig } from './config/create-vite-config';
import { loadConfig } from './config/load-config';

export type AuroraBuildOptions = {
    /** Aurora project root. Defaults to the current working directory. */
    root?: string;
    /** Vite mode used to load environment variables and resolve mode-specific configuration. */
    mode?: string;
};

type AuroraServerOptions = AuroraBuildOptions & {
    host?: ServerOptions['host'];
    port?: ServerOptions['port'];
    open?: ServerOptions['open'];
};

export type AuroraDevOptions = AuroraServerOptions & {
    /** Called whenever the server starts, including after an Aurora config change. */
    onServerStart?: (server: ViteDevServer) => void | Promise<void>;
};

export type AuroraPreviewOptions = AuroraServerOptions;

export type AuroraDevServer = {
    /** The active Vite server. This changes when Aurora restarts after a config update. */
    readonly server: ViteDevServer;
    close: () => Promise<void>;
    printUrls: () => void;
};

const projectRoot = (root?: string) => resolve(root ?? process.cwd());

/** Builds an Aurora project for production. */
export const build = async ({ mode, root }: AuroraBuildOptions = {}): Promise<void> => {
    const config = await loadConfig(projectRoot(root));
    await viteBuild(createViteConfig(config, { mode }));
};

/** Serves a built Aurora project locally. */
export const preview = async ({ host, mode, open, port, root }: AuroraPreviewOptions = {}): Promise<PreviewServer> => {
    const config = await loadConfig(projectRoot(root));
    return vitePreview(createViteConfig(config, { mode, preview: { host, open, port } }));
};

/** Starts an Aurora development server and reloads it when the Aurora config changes. */
export const dev = async ({
    host,
    mode,
    onServerStart,
    open,
    port,
    root,
}: AuroraDevOptions = {}): Promise<AuroraDevServer> => {
    const resolvedRoot = projectRoot(root);
    let server: ViteDevServer | undefined;
    let watcher: FSWatcher | undefined;
    let restart: Promise<void> | undefined;
    let closed = false;

    const start = async () => {
        const config = await loadConfig(resolvedRoot);
        if (closed) return;

        const nextServer = await createServer(createViteConfig(config, { mode, server: { host, open, port } }));

        try {
            await nextServer.listen();
        } catch (error) {
            await nextServer.close();
            throw error;
        }

        if (closed) {
            await nextServer.close();
            return;
        }

        server = nextServer;
        await onServerStart?.(server);

        watcher?.close();
        if (config.configFile) {
            watcher = watch(config.configFile, () => {
                if (restart || closed) return;

                restart = (async () => {
                    watcher?.close();
                    watcher = undefined;
                    await server?.close();
                    if (!closed) await start();
                })()
                    .catch((error: unknown) => console.error(error))
                    .finally(() => {
                        restart = undefined;
                    });
            });
        }
    };

    await start();

    return {
        get server() {
            return server!;
        },
        close: async () => {
            closed = true;
            watcher?.close();
            watcher = undefined;
            await restart;
            await server?.close();
        },
        printUrls: () => server!.printUrls(),
    } satisfies AuroraDevServer;
};
