import { buildPreviewDocument } from '../../lib/run-playground';
import { getCompileDiagnostics } from '../../lib/transpile';
import type { ControllerState } from './controller-state';
import type { PlaygroundDiagnostic } from './types';

export const createPreviewTools = ({ state, isCancelled }: { state: ControllerState; isCancelled: () => boolean }) => {
    let debounceHandle: number | undefined;
    let previewSession = '';
    let previewUrls: string[] = [];
    let runId = 0;

    const revokePreviewUrls = () => {
        for (const url of previewUrls) URL.revokeObjectURL(url);
        previewUrls = [];
    };
    const reportError = (message: string) => {
        state.previewEvents.update((events) => [...events.slice(-99), { level: 'error', message }]);
        state.consoleOpen.set(true);
    };
    const run = async () => {
        const currentRun = ++runId;
        const session = `${currentRun}-${Date.now()}`;
        state.previewEvents.set([]);
        state.diagnostics.set([]);
        try {
            const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
            const files = state.files();
            const entryPath = files.find((file) => file.path === 'main.ts')?.path ?? files[0]?.path ?? '';
            const result = await buildPreviewDocument(files, entryPath, theme, session);
            if (isCancelled() || currentRun !== runId) return;
            revokePreviewUrls();
            previewUrls = result.urls;
            previewSession = session;
            state.preview.set(result.document);
            state.status.set('');
        } catch (error) {
            if (isCancelled() || currentRun !== runId) return;
            const values = getCompileDiagnostics(error).filter((diagnostic): diagnostic is PlaygroundDiagnostic =>
                Boolean(diagnostic.path),
            );
            state.diagnostics.set(values);
            state.status.set(
                values[0]?.message ?? (error instanceof Error ? error.message : 'Failed to run the playground.'),
            );
            if (values.length > 0) state.consoleOpen.set(true);
        }
    };
    const scheduleRun = () => {
        window.clearTimeout(debounceHandle);
        debounceHandle = window.setTimeout(() => void run(), 400);
    };
    const dispose = () => {
        ++runId;
        window.clearTimeout(debounceHandle);
        revokePreviewUrls();
    };

    return { dispose, previewSession: () => previewSession, reportError, run, scheduleRun };
};
