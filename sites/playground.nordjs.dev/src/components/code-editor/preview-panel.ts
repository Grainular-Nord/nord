import { derived, type WritableGrain } from '@grainular/grains';
import { $each, $if, html, mounted, on } from '@grainular/nord';
import type { EditorLayout, PreviewEvent, PreviewMessage } from './types';

export const PreviewPanel = ({
    consoleOpen,
    layout,
    onRun,
    preview,
    previewEvents,
    session,
    status,
    title,
}: {
    consoleOpen: WritableGrain<boolean>;
    layout: WritableGrain<EditorLayout>;
    onRun: () => void;
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
            <button class="aurora-code-editor-run" type="button" title="Run preview (Ctrl/Cmd+Enter)" ${on('click', onRun)}>Run</button>
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
