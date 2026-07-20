// Browser-side TypeScript compilation for the default Nørd preview.
import * as esbuild from 'esbuild-wasm';

const ESBUILD_VERSION = '0.28.1';

let ready: Promise<void> | undefined;

/** Serializable subset of an esbuild diagnostic used by the editor gutter. */
export type CompileDiagnostic = {
    column: number;
    length: number;
    line: number;
    message: string;
    path?: string;
};

/** esbuild-wasm initializes once per browser session and is shared by runs. */
const ensureReady = () => {
    ready ??= esbuild.initialize({
        worker: true,
        wasmURL: `https://esm.sh/esbuild-wasm@${ESBUILD_VERSION}/esbuild.wasm`,
    });
    return ready;
};

/** Strips TypeScript syntax without bundling imports, preserving ESM modules. */
export const stripTypes = async (source: string, path = 'input.ts') => {
    await ensureReady();
    const result = await esbuild.transform(source, {
        loader: 'ts',
        format: 'esm',
        sourcefile: path,
        target: 'esnext',
    });
    return result.code;
};

/** Converts an arbitrary esbuild failure into safe, editor-friendly diagnostics. */
export const getCompileDiagnostics = (error: unknown): CompileDiagnostic[] => {
    if (!error || typeof error !== 'object' || !('errors' in error) || !Array.isArray(error.errors)) return [];

    return error.errors.flatMap((message) => {
        if (!message || typeof message !== 'object' || !('text' in message) || typeof message.text !== 'string')
            return [];

        const location =
            'location' in message && message.location && typeof message.location === 'object'
                ? message.location
                : undefined;
        return [
            {
                column: location && 'column' in location && typeof location.column === 'number' ? location.column : 0,
                length: location && 'length' in location && typeof location.length === 'number' ? location.length : 1,
                line: location && 'line' in location && typeof location.line === 'number' ? location.line : 1,
                message: message.text,
                path: location && 'file' in location && typeof location.file === 'string' ? location.file : undefined,
            },
        ];
    });
};
