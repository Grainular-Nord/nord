import { combined, derived, grain } from '@grainular/grains';
import { mounted } from '@grainular/nord';
import { buildPreviewDocument } from '../preview/nord-preview';
import { getCompileDiagnostics } from '../preview/transpile';
import { ensureScriptPath } from './project';
import type {
    EditorDiagnostic,
    EditorFile,
    EditorLayout,
    EditorPreviewEvent,
    EditorProjectSource,
    EditorTool,
    EditorToolDefinition,
} from './types';

/** Copies files at engine boundaries so host-owned configuration cannot be mutated. */
const copyFiles = (files: EditorFile[]) => files.map((file) => ({ ...file }));
/** Removes an optional `src/` prefix; the engine stores every path source-relative. */
const relativePath = (path: string) => path.replace(/^\/?src\//, '').replace(/^\/+/, '');
const normalizeProject = (project: EditorFile[]) => project.map((file) => ({ ...file, path: relativePath(file.path) }));

/** The live state and actions consumed by the default UI and host-defined tools. */
export type NordEditorEngine = ReturnType<typeof createNordEditorEngine>;

/** Host configuration for the complete Nørd editor runtime. */
export type NordEditorEngineOptions = {
    /** Initial virtual project, or an asynchronous loader for it. */
    files: EditorProjectSource;
    /** Optional formatter invoked by the default Format action. */
    format?: (source: string, path: string) => Promise<string>;
    /** Import map exposed to code executing in the preview iframe. */
    imports: Record<string, string>;
    /** Initial preview layout; defaults to the stacked arrangement. */
    initialLayout?: EditorLayout;
    /** File selected after the initial load; defaults to `main.ts` or the first file. */
    initialPath?: string;
    /** Toolbar contributions evaluated after the engine has been constructed. */
    tools?: EditorToolDefinition<NordEditorEngine>[];
};

/**
 * Creates the complete reactive editor runtime.
 *
 * The engine owns mutable UI state, preview lifecycle, and file operations.
 * Hosts own only project loading, import-map policy, formatting, and optional
 * toolbar tools. This keeps the default components reusable without making
 * package resolution a concern of the editor itself.
 */
export const createNordEditorEngine = (options: NordEditorEngineOptions) => {
    const files = grain<EditorFile[]>([]);
    const activePath = grain<string | undefined>(undefined);
    const layout = grain<EditorLayout>(options.initialLayout ?? 'stacked');
    const consoleOpen = grain(false);
    const diagnostics = grain<EditorDiagnostic[]>([]);
    const preview = grain('');
    const previewEvents = grain<EditorPreviewEvent[]>([]);
    const status = grain('');
    const activeFile = derived(combined([files, activePath]), ([project, path]) =>
        project.find((file) => file.path === path),
    );
    let initialFiles: EditorFile[] = [];
    let debounce: number | undefined;
    let cancelled = false;
    let previewUrls: string[] = [];
    let previewSession = '';
    let runId = 0;

    /** Revoke the previous run's module URLs only after the next run succeeds. */
    const revokePreviewUrls = () => {
        for (const url of previewUrls) URL.revokeObjectURL(url);
        previewUrls = [];
    };
    const reportError = (message: string) => {
        previewEvents.update((events) => [...events.slice(-99), { level: 'error', message }]);
        consoleOpen.set(true);
    };
    /**
     * Compiles the virtual project into a self-contained iframe document.
     * `runId` prevents an older, slower run from replacing newer editor state.
     */
    const run = async () => {
        const currentRun = ++runId;
        const session = `${currentRun}-${Date.now()}`;
        previewEvents.set([]);
        diagnostics.set([]);
        try {
            const project = files();
            const entryPath = project.find((file) => file.path === 'main.ts')?.path ?? project[0]?.path ?? '';
            const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
            const result = await buildPreviewDocument(project, entryPath, theme, session, options.imports);
            if (cancelled || currentRun !== runId) return;
            revokePreviewUrls();
            previewUrls = result.urls;
            previewSession = session;
            preview.set(result.document);
            status.set('');
        } catch (error) {
            if (cancelled || currentRun !== runId) return;
            const values = getCompileDiagnostics(error).filter((value): value is EditorDiagnostic =>
                Boolean(value.path),
            );
            diagnostics.set(values);
            status.set(values[0]?.message ?? (error instanceof Error ? error.message : 'Failed to run the preview.'));
            if (values.length > 0) consoleOpen.set(true);
        }
    };
    /** Debounces edits while still allowing an explicit Run action to be immediate. */
    const scheduleRun = () => {
        window.clearTimeout(debounce);
        debounce = window.setTimeout(() => void run(), 400);
    };
    /** Replaces the entire virtual project and selects `main.ts` where present. */
    const applyProject = async (project: EditorFile[]) => {
        const next = normalizeProject(project);
        files.set(next);
        activePath.set(next.find((file) => file.path === 'main.ts')?.path ?? next[0]?.path);
        await run();
    };
    /** Mount lifecycle: load the host project once, then dispose preview resources. */
    const load = mounted(() => {
        void (async () => {
            try {
                const source = typeof options.files === 'function' ? await options.files() : options.files;
                if (cancelled || source.length === 0) return;
                initialFiles = copyFiles(source);
                await applyProject(source);
                const initialPath = options.initialPath && relativePath(options.initialPath);
                if (initialPath && files().some((file) => file.path === initialPath)) activePath.set(initialPath);
            } catch (error) {
                if (!cancelled) status.set(error instanceof Error ? error.message : 'Failed to load editor files.');
            }
        })();
        return () => {
            cancelled = true;
            ++runId;
            window.clearTimeout(debounce);
            revokePreviewUrls();
        };
    });
    const updateActiveFile = (contents: string) => {
        const path = activePath();
        if (!path) return;
        files.update((project) => project.map((file) => (file.path === path ? { ...file, contents } : file)));
        scheduleRun();
    };
    const addFile = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        const path = relativePath(ensureScriptPath(trimmed));
        if (files().some((file) => file.path === path)) return status.set(`"${path}" already exists.`);
        files.update((project) => [...project, { path, contents: `// ${path}\nexport {};\n` }]);
        activePath.set(path);
        scheduleRun();
    };
    const deleteFile = (path: string) => {
        if (files().length <= 1) return;
        files.update((project) => project.filter((file) => file.path !== path));
        if (activePath() === path)
            activePath.set(files().find((file) => file.path === 'main.ts')?.path ?? files()[0]?.path);
        scheduleRun();
    };
    const renameFile = (path: string, nextPath: string) => {
        const name = relativePath(nextPath.trim());
        if (!name || name === path || files().some((file) => file.path === name)) return false;
        files.update((project) => project.map((file) => (file.path === path ? { ...file, path: name } : file)));
        if (activePath() === path) activePath.set(name);
        scheduleRun();
        return true;
    };
    const format = async () => {
        const current = activeFile();
        if (!current || !options.format) return;
        try {
            const contents = await options.format(current.contents, current.path);
            if (activePath() !== current.path) return;
            files.update((project) =>
                project.map((file) => (file.path === current.path ? { ...file, contents } : file)),
            );
            await run();
        } catch (error) {
            reportError(error instanceof Error ? error.message : 'Failed to format this file.');
        }
    };
    /** Restore the snapshot captured after the initial project loader resolves. */
    const reset = () => void applyProject(initialFiles);
    const engine = {
        activeFile,
        activePath,
        addFile,
        applyProject,
        consoleOpen,
        deleteFile,
        diagnostics,
        files,
        format,
        initialFiles: () => copyFiles(initialFiles),
        layout,
        load,
        preview,
        previewEvents,
        previewSession: () => previewSession,
        renameFile,
        reportError,
        reset,
        run,
        scheduleRun,
        status,
        updateActiveFile,
    };
    const tools = (): EditorTool[] =>
        (options.tools ?? [])
            .map((definition) => definition(engine as NordEditorEngine))
            .filter((tool): tool is EditorTool => Boolean(tool));
    return { ...engine, tools };
};
