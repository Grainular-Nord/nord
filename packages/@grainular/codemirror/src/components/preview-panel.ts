import { derived, type WritableGrain } from '@grainular/grains';
import { $each, $if, html, mounted, on } from '@grainular/nord';
import type { EditorLayout, EditorPreviewEvent, EditorPreviewMessage, EditorTool } from '../core/types';

/**
 * Default sandbox output panel. It renders the iframe document supplied by the
 * engine and accepts only messages stamped with the current preview session.
 */
export const PreviewPanel = ({
    consoleOpen,
    layout,
    preview,
    previewEvents,
    session,
    status,
    title,
    tools,
}: {
    consoleOpen: WritableGrain<boolean>;
    layout: WritableGrain<EditorLayout>;
    preview: WritableGrain<string>;
    previewEvents: WritableGrain<EditorPreviewEvent[]>;
    session: () => string;
    status: WritableGrain<string>;
    title?: string;
    tools: EditorTool[];
}) => {
    const hasConsoleOutput = derived(previewEvents, (events) => events.length > 0);
    const consoleCount = derived(previewEvents, (events) => events.length);
    const isSplit = derived(layout, (value) => value === 'split');
    const isStacked = derived(layout, (value) => value === 'stacked');
    /** Session filtering prevents console output from an obsolete iframe leaking into a new run. */
    const receiveMessages = mounted((host) => {
        if (!(host instanceof HTMLIFrameElement)) return () => {};
        const receive = (event: MessageEvent<EditorPreviewMessage>) => {
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

    return html`<div data-grainular-editor="preview-panel" data-console-open="${consoleOpen}">
        <div data-grainular-editor="preview-toolbar">
            <span data-grainular-editor="status" aria-live="polite">${status}</span>
            <div data-grainular-editor="toolbar-tools">
                <div data-grainular-editor="layout-toggle" aria-label="Editor layout">
                    <button
                        type="button"
                        aria-label="Stack editor and preview"
                        title="Stack editor and preview"
                        aria-pressed="${isStacked}"
                        ${on('click', () => layout.set('stacked'))}
                    >
                        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h10v4H3zM3 9h10v4H3z" /></svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Split editor and preview"
                        title="Split editor and preview"
                        aria-pressed="${isSplit}"
                        ${on('click', () => layout.set('split'))}
                    >
                        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h4v10H3zM9 3h4v10H9z" /></svg>
                    </button>
                </div>
                ${$each(() => tools)
                    .$withKey((tool) => tool.id)
                    .$as(
                        (tool) =>
                            html`<button
                                data-grainular-editor="${tool.id === 'run' ? 'run' : 'tool'}"
                                type="button"
                                title="${tool.title ?? tool.label}"
                                ${on('click', () => void tool.run())}
                            >
                                ${tool.label}
                            </button>`,
                    )}
                <button
                    data-grainular-editor="console-toggle"
                    type="button"
                    aria-expanded="${consoleOpen}"
                    ${on('click', () => consoleOpen.update((open) => !open))}
                >
                    Console${consoleCount}
                </button>
            </div>
        </div>
        <iframe
            title="${title ?? 'Nørd playground preview'}"
            data-grainular-editor="preview-frame"
            sandbox="allow-scripts allow-same-origin"
            srcdoc="${preview}"
            ${receiveMessages}
        ></iframe>
        <div data-grainular-editor="console" role="log" aria-label="Preview console" aria-live="polite">
            <div data-grainular-editor="console-toolbar">
                <span>Console</span><button type="button" ${on('click', () => previewEvents.set([]))}>Clear</button>
            </div>
            ${$if(hasConsoleOutput)
                .$then(
                    () =>
                        html`<ol>
                            ${$each(previewEvents).$as(
                                (event) => html`<li data-level="${event.level}">${event.message}</li>`,
                            )}
                        </ol>`,
                )
                .$else(() => html`<p>No preview output.</p>`)}
        </div>
    </div>`;
};
