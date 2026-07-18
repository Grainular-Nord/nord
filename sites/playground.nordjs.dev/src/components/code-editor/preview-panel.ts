import { derived, type WritableGrain } from '@grainular/grains';
import { $each, $if, html, mounted, on } from '@grainular/nord';
import type { CodeEditorControls, EditorLayout, PreviewEvent, PreviewMessage } from './types';

export const PreviewPanel = ({
    controls,
    consoleOpen,
    layout,
    onFormat,
    onReset,
    onRun,
    onSolve,
    preview,
    previewEvents,
    session,
    status,
    title,
}: {
    controls?: CodeEditorControls;
    consoleOpen: WritableGrain<boolean>;
    layout: WritableGrain<EditorLayout>;
    onFormat: () => void;
    onReset: () => void;
    onRun: () => void;
    onSolve: () => void;
    preview: WritableGrain<string>;
    previewEvents: WritableGrain<PreviewEvent[]>;
    session: () => string;
    status: WritableGrain<string>;
    title?: string;
}) => {
    const hasConsoleOutput = derived(previewEvents, (events) => events.length > 0);
    const consoleCount = derived(previewEvents, (events) => events.length);
    const isSplit = derived(layout, (value) => value === 'split');
    const isStacked = derived(layout, (value) => value === 'stacked');
    const receiveMessages = mounted((host) => {
        if (!(host instanceof HTMLIFrameElement)) return () => {};
        const receive = (event: MessageEvent<PreviewMessage>) => {
            if (
                event.source === host.contentWindow &&
                event.data?.channel === 'nord-playground' &&
                event.data.session === session()
            ) {
                previewEvents.update((events) => [...events.slice(-99), event.data.event]);
            }
        };
        window.addEventListener('message', receive);
        return () => window.removeEventListener('message', receive);
    });

    return html`<div class="aurora-code-editor-preview-panel" data-console-open="${consoleOpen}">
        <div class="aurora-code-editor-preview-toolbar">
            <span>Preview</span>
            <div class="aurora-code-editor-layout-toggle" aria-label="Editor layout">
                <button type="button" aria-label="Stack editor and preview" title="Stack editor and preview" aria-pressed="${isStacked}" ${on('click', () => layout.set('stacked'))}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h10v4H3zM3 9h10v4H3z" /></svg></button>
                <button type="button" aria-label="Split editor and preview" title="Split editor and preview" aria-pressed="${isSplit}" ${on('click', () => layout.set('split'))}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h4v10H3zM9 3h4v10H9z" /></svg></button>
            </div>
            ${controls?.format !== false && html`<button class="aurora-code-editor-action" type="button" title="Format file (Ctrl/Cmd+S)" ${on('click', onFormat)}>Format</button>`}
            <button class="aurora-code-editor-run" type="button" title="Run preview (Ctrl/Cmd+Enter)" ${on('click', onRun)}>Run</button>
            ${controls?.reset && html`<button class="aurora-code-editor-action" type="button" title="Reset lesson" ${on('click', onReset)}>Reset</button>`}
            ${controls?.solve && html`<button class="aurora-code-editor-action" type="button" title="Load lesson solution" ${on('click', onSolve)}>Solve</button>`}
            <button class="aurora-code-editor-console-toggle" type="button" aria-expanded="${consoleOpen}" ${on('click', () => consoleOpen.update((open) => !open))}>Console${consoleCount}</button>
            <span class="aurora-code-editor-status" aria-live="polite">${status}</span>
        </div>
        <iframe title="${title ?? 'Nørd playground preview'}" class="aurora-code-editor-frame" sandbox="allow-scripts allow-same-origin" srcdoc="${preview}" ${receiveMessages}></iframe>
        <div class="aurora-code-editor-console" role="log" aria-label="Preview console" aria-live="polite">
            <div class="aurora-code-editor-console-toolbar"><span>Console</span><button type="button" ${on('click', () => previewEvents.set([]))}>Clear</button></div>
            ${$if(hasConsoleOutput)
                .$then(
                    () =>
                        html`<ol>${$each(previewEvents).$as((event) => html`<li data-level="${event.level}">${event.message}</li>`)}</ol>`,
                )
                .$else(() => html`<p>No preview output.</p>`)}
        </div>
    </div>`;
};
