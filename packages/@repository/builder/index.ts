/** @format */

import type { BuildConfig, BunPlugin, Target } from 'bun';
import { existsSync } from 'node:fs';
import { rm, watch } from 'node:fs/promises';
import { dirname, join, sep } from 'node:path';
import { styleText } from 'node:util';
import { createProgram, DiagnosticCategory, getPreEmitDiagnostics } from 'typescript';

const strip = (path: string) => path.replace(process.cwd(), '');

const basepath = (paths: string[]) => {
    return join(...[...paths.map((path) => new Set(path.split(sep))).reduce((acc, cur) => acc.intersection(cur))]);
};

const colors = { esm: 'cyan', dts: 'blue', cjs: 'green', iife: 'magenta' } as const;

const log = {
    error: (error: string) => console.log(styleText('bold', styleText('red', '✕ Error during build:\n')), error),
    neutral: (message: string) => console.log(styleText('dim', styleText('gray', message))),
    output: (format: 'esm' | 'cjs' | 'dts' | 'iife', message: string) =>
        console.log(
            styleText('bold', styleText(colors[format], `[ ${format.toLocaleUpperCase()} ]`)),
            styleText(colors[format], message),
        ),
};

/**
 * Unfortunately, Bun doesn't have a good way to bundle `.d.ts`
 * files yet. We can however simply reuse the existing `tsc` installation
 * and directly generate the `.d.ts` files using `TypeScript`
 */
const writeDtsBundle = ({ entry, outDir }: { entry: string; outDir: string }) => {
    return new Promise<void>((resolve, reject) => {
        // Create the compiler options used to run the compile program
        const options = { declaration: true, emitDeclarationOnly: true, noCheck: true, outDir };

        const program = createProgram([entry], options);
        const result = program.emit();

        for (const diag of getPreEmitDiagnostics(program).concat(result.diagnostics)) {
            if (diag.category === DiagnosticCategory.Error) {
                return reject('Error during .d.ts emit');
            }
        }

        if (result.emitSkipped) {
            return reject('Error during .d.ts emit');
        }

        resolve();
    });
};

type Package = {
    // While `name` and `package` are not optional fields,
    // we do not require them for building the bundle, just
    // for communicating better what's happening.
    name?: string;
    version?: string;
    /**
     * The field declaring the output location for the compiled CJS bundle.
     * As the bundle will only ever generate a index.js (by design), this should
     * place the file in a distinct directory (./dist/cjs/index.js)
     */
    main: string;

    /**
     * The field declaring the output location for the compiled ESM bundle.
     * As the bundle will only ever generate a index.js (by design), this should
     * place the file in a distinct directory (./dist/esm/index.js)
     */
    module?: string;

    /**
     * The field declaring the output location for the compiled .d.ts files
     */
    types?: string;
};
type Manifest = Package & {
    /**
     * The **Manifest** should declare an entry point for the
     * bundler to start. Ideally, this is the `./src/index.ts`
     * file. We cannot use the `main` / `module` field, as those
     * will point to the compiled javascript files
     */
    entry: string;
    /**
     * The field declaring the output location for a IIFE bundle that can be
     * served via cdn.
     * As the bundle will only ever generate a index.js (by design), this should
     * place the file in a distinct directory (./dist/cdn/index.js)
     */
    cdn?: string;
    /**
     * Things marked as external will not be included in the build output
     */
    external?: string[];
};

type Options = {
    watch: boolean;
    clean: boolean;
    verbose: boolean;
    buildConfig?: Partial<BuildConfig>;
};

const defaultOptions = { watch: true, clean: true, verbose: false, buildConfig: {} } satisfies Options;
export class Builder {
    // Config fields
    private target: Target = 'bun';
    private watch: boolean = true;
    private clean: boolean = true;
    private verbose: boolean = false;
    private buildConfig: Partial<BuildConfig> = {};

    // Build specific fields
    private external: string[] = [];
    constructor(config: Options = defaultOptions) {
        Object.assign(this, config);

        process.on('SIGINT', () => {
            this.terminate();
        });
    }

    /**
     * @param { Target } target
     * Set the target for the `build` script
     * - **bun**: Build for bun (default)
     * - **node**: Build for node (Can contain node built ins)
     * - **browser**: Build for browser
     */
    for(target: Target) {
        this.target = target;
        return this;
    }

    private plugins: BunPlugin[] = [];

    /**
     * @param { BunPlugin[] } plugins
     * Add Plugins to the build Chain.
     */
    use(...plugins: BunPlugin[]) {
        this.plugins = plugins;
        return this;
    }

    /**
     * Supply a `Manifest` object to start the build process
     * @param { Manifest } manifest
     */
    async from(manifest: Manifest) {
        // Set the per manifest build config;
        this.external = manifest.external ?? [];

        if (this.watch) {
            this.watchFiles(manifest);
        }

        return await this.build(manifest);
    }

    private abortController = new AbortController();
    private terminate() {
        this.abortController.abort();
        process.exit(1);
    }

    private reportOutput({ message, level }: BuildMessage | ResolveMessage) {
        switch (true) {
            case level === 'error':
                // We will always log an error, and as the process itself
                // will fail, terminate the build process running with exitcode 1
                // This will also allow us to clean up any leftover watchers or
                // other processes.
                log.error(message);
                this.terminate();
                break;
            case this.verbose === true && level !== 'error':
                // By default, we will only emit other messages
                // if the verbose flag has been set to true
                console.log(log);
        }
    }

    private async buildCommonBundle(format: 'esm' | 'cjs' | 'iife', entry: string, outDir: string) {
        log.output(format, `${strip(entry)} ❯❯❯ ${strip(outDir)}/index.js`);
        const result = await Bun.build({
            ...this.buildConfig,
            target: this.target,
            external: this.external,
            packages: this.buildConfig.packages ?? (this.external.length === 0 ? 'bundle' : 'external'),
            entrypoints: [entry],
            format,
            outdir: outDir,
            sourcemap: 'external',
            plugins: this.plugins ?? [],
            throw: false,
            minify: this.target === 'browser',
            splitting: false,
        });

        if (result.success) {
            log.output(format, `Build ${strip(outDir)}/index.js`);
            return;
        }

        for (const message of result.logs) {
            this.reportOutput(message);
        }
    }

    // The type bundle is slightly different, as Bun itself cannot generate
    // the types bundle. We utilize the existing TSC installation to generate
    // a d.ts export based on the required environment
    private async buildDts(entry: string, outDir: string) {
        log.output('dts', `${strip(entry)} ❯❯❯ ${strip(outDir)}/index.d.ts`);

        // Build the actual bundle
        try {
            await writeDtsBundle({ entry, outDir });
            log.output('dts', `Build ${strip(outDir)}/index.d.ts`);
        } catch (e) {
            if (e instanceof Error) {
                log.error(e.message);
                this.terminate();
            }
        }
    }

    private async watchFiles(manifest: Manifest) {
        const base = dirname(manifest.entry);
        const output = basepath([manifest.main, manifest.module ?? manifest.main, manifest.types ?? manifest.main]);

        try {
            const watcher = watch(base, { recursive: true, signal: this.abortController.signal });

            for await (const change of watcher) {
                // We want to ignore any events happening
                // in the output directory, as to not
                // accidentally create a infinite loop
                if (change.filename?.startsWith(output)) {
                    continue;
                }

                // Trigger a rebuild if the changes are
                // not inside a ignored directory
                console.clear();
                log.neutral(`${new Date().toLocaleTimeString()} Changes detected. Rebuilding...`);
                await this.build(manifest);
            }
        } catch (e) {
            if (e instanceof Error && e.name === 'AbortError') {
                return;
            }

            throw e;
        }
    }
    private async build(manifest: Manifest) {
        // The input directory
        const root = process.cwd();
        const entry = join(root, manifest.entry);

        // The output locations for the three generated bundles
        const cjs = dirname(join(root, manifest.main));
        const esm = manifest.module ? dirname(join(root, manifest.module)) : null;
        const types = manifest.types ? dirname(join(root, manifest.types)) : null;
        const base = basepath([cjs, esm ?? cjs, types ?? cjs]);

        // We want to clean the output directory
        // before starting the next build. This can
        // be disabled by the options passed to the
        // `Builder`
        if (this.clean && existsSync(base)) {
            await rm(base, { recursive: true, force: true });
        }

        // Trigger the individual package builds
        // - CJS & ESM will always be build
        // - Dts will also always be build
        // - Browser (CDN) will be skipped if the target is not browser

        if (esm) {
            await this.buildCommonBundle('esm', entry, esm);
        }

        await this.buildCommonBundle('cjs', entry, cjs);

        // Build cdn if required
        if (manifest.cdn && this.target === 'browser') {
            await this.buildCommonBundle('iife', entry, dirname(join(root, manifest.cdn)));
        }

        // Build types
        if (types) {
            await this.buildDts(entry, types);
        }
    }
}

export const build = new Builder();
