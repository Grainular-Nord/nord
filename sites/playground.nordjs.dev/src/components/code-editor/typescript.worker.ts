import * as ts from 'typescript';

type ProjectFile = { path: string; contents: string };
type Request =
    | { files: ProjectFile[]; type: 'sync' }
    | { id: number; path: string; position: number; type: 'completions' | 'quick-info' };

const declarationsPath = 'nord-playground.d.ts';
const declarations = `
declare type TemplateStringsArray = readonly string[] & { readonly raw: readonly string[] };
declare class Element {}
declare class HTMLElement extends Element {}
declare class HTMLInputElement extends HTMLElement { select(): void; focus(): void; }
declare const document: { querySelector(selector: string): Element | null };
declare const window: { setInterval(callback: () => void, timeout?: number): number; clearInterval(id: number): void; setTimeout(callback: () => void, timeout?: number): number };
declare const crypto: { randomUUID(): string };
declare module '@grainular/grains' {
    export type Grain<T> = { (): T; set(value: T): void; update(update: (value: T) => T): void };
    export const grain: <T>(value: T) => Grain<T>;
    export const derived: <T, R>(source: Grain<T>, derive: (value: T) => R) => Grain<R>;
    export const combined: <T extends readonly Grain<unknown>[]>(sources: T) => Grain<{ [Key in keyof T]: T[Key] extends Grain<infer Value> ? Value : never }>;
}
declare module '@grainular/nord' {
    export type PureComponent<Props = object> = (props: Props) => unknown;
    export type PropsWithChildren<Props = object> = Props & { children?: unknown };
    export const html: (strings: TemplateStringsArray, ...values: unknown[]) => unknown;
    export const mount: (component: unknown, options: { to: Element | null }) => void;
    export const on: (event: string, listener: (...args: unknown[]) => void) => unknown;
    export const $if: (value: unknown) => unknown;
    export const $each: (value: unknown) => unknown;
    export const $await: (value: unknown) => unknown;
    export const createRef: <T>() => { current?: T };
    export const ref: (value: unknown) => unknown;
    export const createDirective: <T extends Element>(run: (element: T) => void | (() => void)) => unknown;
    export const mounted: (run: (element: Element) => void | (() => void)) => unknown;
}
`;

const files = new Map<string, string>([[declarationsPath, declarations]]);
const versions = new Map<string, number>([[declarationsPath, 1]]);

const host: ts.LanguageServiceHost = {
    getCompilationSettings: () => ({
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        noLib: true,
        strict: true,
        target: ts.ScriptTarget.ESNext,
    }),
    getCurrentDirectory: () => '/',
    getDefaultLibFileName: () => declarationsPath,
    getScriptFileNames: () => [...files.keys()],
    getScriptSnapshot: (path) => {
        const contents = files.get(path);
        return contents === undefined ? undefined : ts.ScriptSnapshot.fromString(contents);
    },
    getScriptVersion: (path) => `${versions.get(path) ?? 0}`,
    readFile: (path) => files.get(path),
    fileExists: (path) => files.has(path),
};

const languageService = ts.createLanguageService(host);

const display = (parts: ts.SymbolDisplayPart[] | undefined) => ts.displayPartsToString(parts);
const sync = (project: ProjectFile[]) => {
    const nextPaths = new Set(project.map((file) => file.path));
    for (const path of files.keys()) {
        if (path !== declarationsPath && !nextPaths.has(path)) files.delete(path);
    }
    for (const file of project) {
        if (files.get(file.path) !== file.contents) {
            files.set(file.path, file.contents);
            versions.set(file.path, (versions.get(file.path) ?? 0) + 1);
        }
    }
};

self.onmessage = ({ data }: MessageEvent<Request>) => {
    if (data.type === 'sync') {
        sync(data.files);
        return;
    }

    if (data.type === 'completions') {
        const result = languageService.getCompletionsAtPosition(data.path, data.position, {});
        self.postMessage({
            id: data.id,
            result: result?.entries.map((entry) => ({ detail: entry.kind, label: entry.name, type: entry.kind })),
        });
        return;
    }

    const result = languageService.getQuickInfoAtPosition(data.path, data.position);
    self.postMessage({
        id: data.id,
        result: result && {
            end: result.textSpan.start + result.textSpan.length,
            start: result.textSpan.start,
            text: display(result.displayParts),
        },
    });
};
