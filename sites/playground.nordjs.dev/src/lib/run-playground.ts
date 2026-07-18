import { stripTypes } from './transpile';

export type ProjectFile = { path: string; contents: string };
export type PreviewEvent = { level: 'error' | 'info' | 'log' | 'warn'; message: string };
export type PreviewMessage = { channel: 'nord-playground'; event: PreviewEvent; session: string };

const CDN_IMPORTS: Record<string, string> = {
    '@grainular/nord': 'https://esm.sh/@grainular/nord@next',
    '@grainular/grains': 'https://esm.sh/@grainular/grains@next',
};

const shell = (
    importMap: Record<string, string>,
    entryUrl: string,
    theme: 'dark' | 'light',
    session: string,
) => `<!doctype html>
<html data-theme="${theme}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="/playground.css" />
<script type="importmap">${JSON.stringify({ imports: importMap })}</script>
</head>
<body>
<div id="app"></div>
<script type="module" src="${entryUrl}"></script>
<script>
(() => {
    const session = ${JSON.stringify(session)};
    const format = (value) => {
        if (value instanceof Error) return value.stack || value.message;
        if (typeof value === 'string') return value;
        try { return JSON.stringify(value); } catch { return String(value); }
    };
    const report = (level, values) => parent.postMessage({
        channel: 'nord-playground',
        session,
        event: { level, message: values.map(format).join(' ') },
    }, location.origin);

    for (const level of ['log', 'info', 'warn', 'error']) {
        const original = console[level];
        console[level] = (...values) => {
            original.apply(console, values);
            report(level, values);
        };
    }

    addEventListener('error', (event) => report('error', [event.error || event.message]));
    addEventListener('unhandledrejection', (event) => report('error', [event.reason]));
})();
</script>
</body>
</html>`;

// Matches `from './x.ts'`, `from "./x"`, and `import('./x.ts')` — the
// relative-import forms lesson files use to reference each other.
const relativeImport = /(from\s+|import\s*\()(['"])\.\/([^'"]+)\2/g;

// Runs the lesson's files directly in the browser: TypeScript is stripped
// (not bundled) per file, and each file becomes a blob-URL module. CDN
// dependencies are resolved through a real import map, but cross-file
// imports between lesson files are NOT — browsers silently fail to resolve
// a relative specifier ("./app.ts") mapped to a blob: URL through an import
// map, even though that same blob: URL works fine as a script `src` or as a
// direct `import` target. So instead, a file that imports a sibling file
// gets its source rewritten to import the sibling's blob URL directly.
// Every file gets a URL up front (used as the dependency target, and — for
// files with no relative imports of their own — as their final URL too);
// only files whose source actually changes get a second, rewritten blob.
export const buildPreviewDocument = async (
    files: ProjectFile[],
    entryPath: string,
    theme: 'dark' | 'light',
    session: string,
): Promise<{ document: string; urls: string[] }> => {
    const knownPaths = new Set(files.map((file) => file.path));
    const resolveRelative = (ref: string) => {
        if (knownPaths.has(ref)) return ref;
        if (knownPaths.has(`${ref}.ts`)) return `${ref}.ts`;
        return undefined;
    };

    const transpiled = await Promise.all(
        files.map(async (file) => ({
            path: file.path,
            code: /\.tsx?$/.test(file.path) ? await stripTypes(file.contents, file.path) : file.contents,
        })),
    );

    const urls = new Map(
        transpiled.map(({ path, code }) => [path, URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))]),
    );
    const createdUrls = [...urls.values()];

    for (const { path, code } of transpiled) {
        const rewritten = code.replace(relativeImport, (match, prefix, quote, ref) => {
            const target = resolveRelative(ref);
            return target ? `${prefix}${quote}${urls.get(target)}${quote}` : match;
        });
        if (rewritten === code) continue;

        const url = URL.createObjectURL(new Blob([rewritten], { type: 'text/javascript' }));
        urls.set(path, url);
        createdUrls.push(url);
    }

    const entryUrl = urls.get(entryPath);
    if (!entryUrl) throw new Error(`Entry file "${entryPath}" was not found.`);

    return { document: shell(CDN_IMPORTS, entryUrl, theme, session), urls: createdUrls };
};
