import { combined, derived, grain } from '@grainular/grains';
import { mounted } from '@grainular/nord';
import { buildPreviewDocument } from '../../lib/run-playground';
import { getCompileDiagnostics } from '../../lib/transpile';
import type { EditorLayout, PlaygroundDiagnostic, PreviewEvent, ProjectFile } from './types';

export const createPlaygroundController = (src: string) => {
    const files = grain<ProjectFile[]>([]);
    const activePath = grain<string | undefined>(undefined);
    const activeFile = derived(combined([files, activePath]), ([project, path]) =>
        project.find((file) => file.path === path),
    );
    const diagnostics = grain<PlaygroundDiagnostic[]>([]);
    const consoleOpen = grain(false);
    const preview = grain('');
    const previewEvents = grain<PreviewEvent[]>([]);
    const status = grain('');
    const layout = grain<EditorLayout>('stacked');
    let cancelled = false;
    let debounceHandle: number | undefined;
    let previewUrls: string[] = [];
    let runId = 0;
    let previewSession = '';

    const revokePreviewUrls = () => {
        for (const url of previewUrls) URL.revokeObjectURL(url);
        previewUrls = [];
    };
    const run = async () => {
        const currentRun = ++runId;
        const session = `${currentRun}-${Date.now()}`;
        previewEvents.set([]);
        diagnostics.set([]);
        try {
            const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
            const entryPath = files().find((file) => file.path === 'main.ts')?.path ?? files()[0]?.path ?? '';
            const result = await buildPreviewDocument(files(), entryPath, theme, session);
            if (cancelled || currentRun !== runId) return;
            revokePreviewUrls();
            previewUrls = result.urls;
            previewSession = session;
            preview.set(result.document);
            status.set('');
        } catch (error) {
            if (cancelled || currentRun !== runId) return;
            const values = getCompileDiagnostics(error).filter((diagnostic): diagnostic is PlaygroundDiagnostic =>
                Boolean(diagnostic.path),
            );
            diagnostics.set(values);
            status.set(
                values[0]?.message ?? (error instanceof Error ? error.message : 'Failed to run the playground.'),
            );
            if (values.length > 0) consoleOpen.set(true);
        }
    };
    const scheduleRun = () => {
        window.clearTimeout(debounceHandle);
        debounceHandle = window.setTimeout(() => void run(), 400);
    };
    const updateActiveFile = (contents: string) => {
        const path = activePath();
        if (!path) return;
        files.update((project) => project.map((file) => (file.path === path ? { ...file, contents } : file)));
        scheduleRun();
    };
    const addFile = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const path = /\.tsx?$/.test(trimmed) ? trimmed : `${trimmed}.ts`;
        if (files().some((file) => file.path === path)) {
            status.set(`"${path}" already exists.`);
            return;
        }
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
    const load = mounted(() => {
        void (async () => {
            try {
                const manifest = await fetch(`${src}files.json`).then(
                    (response) => response.json() as Promise<string[]>,
                );
                const project = await Promise.all(
                    manifest.map(async (path) => ({
                        path,
                        contents: await fetch(`${src}${path}`).then((response) => response.text()),
                    })),
                );
                if (cancelled || project.length === 0) return;
                files.set(project);
                activePath.set(project[0]?.path);
                await run();
            } catch {
                if (!cancelled) status.set('Failed to load the lesson files.');
            }
        })();
        return () => {
            cancelled = true;
            ++runId;
            window.clearTimeout(debounceHandle);
            revokePreviewUrls();
        };
    });
    return {
        activeFile,
        activePath,
        addFile,
        consoleOpen,
        deleteFile,
        diagnostics,
        files,
        layout,
        load,
        preview,
        previewEvents,
        previewSession: () => previewSession,
        run,
        status,
        updateActiveFile,
    };
};
