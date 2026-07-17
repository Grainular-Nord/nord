import * as esbuild from 'esbuild-wasm';

const ESBUILD_VERSION = '0.28.1';

let ready: Promise<void> | undefined;

const ensureReady = () => {
    ready ??= esbuild.initialize({
        worker: true,
        wasmURL: `https://esm.sh/esbuild-wasm@${ESBUILD_VERSION}/esbuild.wasm`,
    });
    return ready;
};

export const stripTypes = async (source: string) => {
    await ensureReady();
    const result = await esbuild.transform(source, { loader: 'ts', format: 'esm', target: 'esnext' });
    return result.code;
};
