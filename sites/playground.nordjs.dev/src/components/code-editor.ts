import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { combined, derived, type Grain, grain } from '@grainular/grains';
import { $each, $if, html, mounted, on } from '@grainular/nord';
import { tags } from '@lezer/highlight';
import { buildPreviewDocument, type ProjectFile } from '../lib/run-playground';
import './code-editor.css';

type CodeEditorProps = { src: string; title?: string };
type EditorLayout = 'split' | 'stacked';

const editorTheme = EditorView.theme(
    {
        '&': {
            height: '100%',
            color: 'var(--aurora-syntax-foreground)',
            backgroundColor: 'var(--aurora-syntax-background)',
        },
        '.cm-scroller': {
            fontFamily: 'var(--aurora-font-mono)',
            lineHeight: '1.6',
        },
        '.cm-content': { padding: '0.9rem 0' },
        '.cm-line': { padding: '0 1rem' },
        '.cm-gutters': {
            minWidth: '3rem',
            color: 'var(--aurora-text-faint)',
            backgroundColor: 'var(--aurora-syntax-background)',
            border: 'none',
        },
        '.cm-gutterElement': { padding: '0 0.75rem 0 0.5rem' },
        '.cm-activeLine': { backgroundColor: 'var(--aurora-overlay)' },
        '.cm-activeLineGutter': { backgroundColor: 'var(--aurora-overlay)' },
        '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--aurora-accent)' },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
            backgroundColor: 'color-mix(in srgb, var(--aurora-accent), transparent 78%)',
        },
        '&.cm-focused': { outline: 'none' },
    },
    { dark: true },
);

const editorHighlight = HighlightStyle.define([
    { tag: tags.comment, color: 'var(--aurora-syntax-token-comment)', fontStyle: 'italic' },
    { tag: [tags.keyword, tags.controlKeyword, tags.operatorKeyword], color: 'var(--aurora-syntax-token-keyword)' },
    { tag: [tags.string, tags.special(tags.string)], color: 'var(--aurora-syntax-token-string-expression)' },
    { tag: [tags.number, tags.bool, tags.null], color: 'var(--aurora-syntax-token-constant)' },
    { tag: [tags.function(tags.variableName), tags.labelName], color: 'var(--aurora-syntax-token-function)' },
    { tag: [tags.punctuation, tags.separator], color: 'var(--aurora-syntax-token-punctuation)' },
]);

const CodeMirror = ({
    file,
    onChange,
}: {
    file: Grain<ProjectFile | undefined>;
    onChange: (contents: string) => void;
}) => {
    let view: EditorView | undefined;
    let path: string | undefined;

    const createState = (current: ProjectFile) =>
        EditorState.create({
            doc: current.contents,
            extensions: [
                lineNumbers(),
                history(),
                javascript({ typescript: true }),
                syntaxHighlighting(editorHighlight),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                editorTheme,
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) onChange(update.state.doc.toString());
                }),
            ],
        });

    const sync = (current: ProjectFile | undefined, host: Element) => {
        if (!current) return;
        if (!view) {
            path = current.path;
            view = new EditorView({ state: createState(current), parent: host });
            return;
        }

        if (path === current.path && view.state.doc.toString() === current.contents) return;
        path = current.path;
        view.setState(createState(current));
    };

    const setup = mounted((host) => {
        const unsubscribe = file.subscribe((current) => sync(current, host));
        sync(file(), host);

        return () => {
            unsubscribe();
            view?.destroy();
        };
    });

    return html`<div class="aurora-code-editor-pane" ${setup}></div>`;
};

const CodeEditor = ({ src, title }: CodeEditorProps) => {
    const files = grain<ProjectFile[]>([]);
    const activePath = grain<string | undefined>(undefined);
    const activeFile = derived(combined([files, activePath]), ([project, path]) =>
        project.find((file) => file.path === path),
    );
    const preview = grain('');
    const status = grain('');
    let cancelled = false;
    let debounceHandle: number | undefined;
    let previewUrls: string[] = [];
    let runId = 0;

    const revokePreviewUrls = () => {
        for (const url of previewUrls) URL.revokeObjectURL(url);
        previewUrls = [];
    };

    const run = async () => {
        const currentRun = ++runId;

        try {
            const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
            // The entry script is always "main.ts" regardless of tab order —
            // manifests list the file with the exercise gap first so it's
            // the one shown (and active) by default.
            const entryPath = files().find((file) => file.path === 'main.ts')?.path ?? files()[0]?.path ?? '';
            const result = await buildPreviewDocument(files(), entryPath, theme);
            if (cancelled || currentRun !== runId) return;

            revokePreviewUrls();
            previewUrls = result.urls;
            preview.set(result.document);
            status.set('');
        } catch (error) {
            if (!cancelled && currentRun === runId)
                status.set(error instanceof Error ? error.message : 'Failed to run the playground.');
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

    const selected = (path: string) => derived(activePath, (current) => current === path);

    const isCreatingFile = grain(false);

    const defaultFileContents = (path: string) => `// ${path}\nexport {};\n`;

    const addFile = (rawName: string) => {
        const trimmed = rawName.trim();
        if (!trimmed) {
            isCreatingFile.set(false);
            return;
        }

        const path = /\.tsx?$/.test(trimmed) ? trimmed : `${trimmed}.ts`;
        if (files().some((file) => file.path === path)) {
            status.set(`"${path}" already exists.`);
            return;
        }

        files.update((project) => [...project, { path, contents: defaultFileContents(path) }]);
        activePath.set(path);
        isCreatingFile.set(false);
        scheduleRun();
    };

    const cancelCreateFile = () => isCreatingFile.set(false);

    const deleteFile = (path: string) => {
        if (files().length <= 1) return;

        files.update((project) => project.filter((file) => file.path !== path));
        if (activePath() === path) {
            const remaining = files();
            activePath.set(remaining.find((file) => file.path === 'main.ts')?.path ?? remaining[0]?.path);
        }
        scheduleRun();
    };

    const hasMultipleFiles = derived(files, (project) => project.length > 1);
    const editorLayout = grain<EditorLayout>('stacked');
    const isEditorSplit = derived(editorLayout, (layout) => layout === 'split');
    const isEditorStacked = derived(editorLayout, (layout) => layout === 'stacked');
    const editorOrientation = derived(editorLayout, (layout) => (layout === 'split' ? 'vertical' : 'horizontal'));

    // A raw input rather than a bound grain — the filename only needs to be
    // read once, on submit, so tracking every keystroke would be wasted work.
    const newFileInput = mounted((host) => {
        if (!(host instanceof HTMLInputElement)) return () => {};
        host.focus();

        const onKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                addFile(host.value);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                cancelCreateFile();
            }
        };
        const onBlur = () => cancelCreateFile();

        host.addEventListener('keydown', onKeydown);
        host.addEventListener('blur', onBlur);

        return () => {
            host.removeEventListener('keydown', onKeydown);
            host.removeEventListener('blur', onBlur);
        };
    });

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

    const resizePreview = mounted((handle) => {
        const workspace = handle.parentElement;
        if (!workspace) return;

        let origin = 0;
        let size = 0;

        const axis = () => (editorLayout() === 'split' && workspace.clientWidth >= 42 * 16 ? 'inline' : 'block');
        const currentSize = () => {
            const workspaceBounds = workspace.getBoundingClientRect();
            const handleBounds = handle.getBoundingClientRect();
            return axis() === 'inline'
                ? handleBounds.left + handleBounds.width / 2 - workspaceBounds.left
                : handleBounds.top + handleBounds.height / 2 - workspaceBounds.top;
        };

        const update = (next: number) => {
            const total = axis() === 'inline' ? workspace.clientWidth : workspace.clientHeight;
            const min = Math.min(16 * 16, total * 0.45);
            const max = total * 0.72;
            const value = Math.min(Math.max(next, min), max);
            const property = axis() === 'inline' ? '--editor-split-size' : '--editor-stacked-size';

            workspace.style.setProperty(property, `${value}px`);
            handle.setAttribute('aria-orientation', axis() === 'inline' ? 'vertical' : 'horizontal');
            handle.setAttribute('aria-valuemin', `${Math.round(min)}`);
            handle.setAttribute('aria-valuemax', `${Math.round(max)}`);
            handle.setAttribute('aria-valuenow', `${Math.round(value)}`);
        };

        const start = (event: PointerEvent) => {
            origin = axis() === 'inline' ? event.clientX : event.clientY;
            size = currentSize();
            update(size);
            handle.setPointerCapture(event.pointerId);
        };

        const move = (event: PointerEvent) => {
            if (!handle.hasPointerCapture(event.pointerId)) return;
            const position = axis() === 'inline' ? event.clientX : event.clientY;
            update(size + position - origin);
        };

        const stop = (event: PointerEvent) => {
            if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
        };

        const keydown = (event: KeyboardEvent) => {
            const vertical = axis() === 'block';
            const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
            if (![...keys, 'Home', 'End'].includes(event.key)) return;

            const total = vertical ? workspace.clientHeight : workspace.clientWidth;
            const min = Math.min(16 * 16, total * 0.45);
            const max = total * 0.72;
            const current = currentSize();
            const direction = event.key === keys[0] ? -24 : event.key === keys[1] ? 24 : 0;
            const next = event.key === 'Home' ? min : event.key === 'End' ? max : current + direction;

            event.preventDefault();
            update(next);
        };

        handle.addEventListener('pointerdown', start);
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', stop);
        handle.addEventListener('pointercancel', stop);
        handle.addEventListener('keydown', keydown);

        return () => {
            handle.removeEventListener('pointerdown', start);
            handle.removeEventListener('pointermove', move);
            handle.removeEventListener('pointerup', stop);
            handle.removeEventListener('pointercancel', stop);
            handle.removeEventListener('keydown', keydown);
        };
    });

    return html`
        <section class="aurora-code-editor" data-layout="${editorLayout}" ${load} aria-label="Interactive code editor">
            <div class="aurora-code-editor-toolbar">
                <div class="aurora-code-editor-tabs" role="tablist" aria-label="Project files">
                    ${$each(files)
                        .$withKey((file) => file.path)
                        .$as(
                            (file) => html`
                                <div class="aurora-code-editor-tab-wrap" role="presentation">
                                    <button
                                        class="aurora-code-editor-tab"
                                        type="button"
                                        role="tab"
                                        aria-selected="${selected(file.path)}"
                                        ${on('click', () => activePath.set(file.path))}
                                    >
                                        ${file.path}
                                    </button>
                                    ${$if(hasMultipleFiles).$then(
                                        () => html`
                                            <button
                                                class="aurora-code-editor-tab-delete"
                                                type="button"
                                                aria-label="Delete ${file.path}"
                                                title="Delete file"
                                                ${on('click', (event) => {
                                                    event.stopPropagation();
                                                    deleteFile(file.path);
                                                })}
                                            >
                                                ×
                                            </button>
                                        `,
                                    )}
                                </div>
                            `,
                        )}
                    ${$if(isCreatingFile)
                        .$then(
                            () => html`
                                <input
                                    class="aurora-code-editor-new-file-input"
                                    type="text"
                                    placeholder="file.ts"
                                    spellcheck="false"
                                    autocomplete="off"
                                    aria-label="New file name"
                                    ${newFileInput}
                                />
                            `,
                        )
                        .$else(
                            () => html`
                                <button
                                    class="aurora-code-editor-tab aurora-code-editor-tab-add"
                                    type="button"
                                    title="New file"
                                    aria-label="New file"
                                    ${on('click', () => isCreatingFile.set(true))}
                                >
                                    +
                                </button>
                            `,
                        )}
                </div>
                <span class="aurora-code-editor-language">TypeScript</span>
            </div>
            <div class="aurora-code-editor-workspace">
                <div class="aurora-code-editor-code-panel">${CodeMirror({ file: activeFile, onChange: updateActiveFile })}</div>
                <div
                    class="aurora-code-editor-resize-handle"
                    role="separator"
                    aria-label="Resize editor and preview"
                    aria-orientation="${editorOrientation}"
                    tabindex="0"
                    ${resizePreview}
                ></div>
                <div class="aurora-code-editor-preview-panel">
                    <div class="aurora-code-editor-preview-toolbar">
                        <span>Preview</span>
                        <div class="aurora-code-editor-layout-toggle" aria-label="Editor layout">
                            <button
                                type="button"
                                aria-label="Stack editor and preview"
                                title="Stack editor and preview"
                                aria-pressed="${isEditorStacked}"
                                ${on('click', () => editorLayout.set('stacked'))}
                            >
                                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h10v4H3zM3 9h10v4H3z" /></svg>
                            </button>
                            <button
                                type="button"
                                aria-label="Split editor and preview"
                                title="Split editor and preview"
                                aria-pressed="${isEditorSplit}"
                                ${on('click', () => editorLayout.set('split'))}
                            >
                                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h4v10H3zM9 3h4v10H9z" /></svg>
                            </button>
                        </div>
                        <span class="aurora-code-editor-status" aria-live="polite">${status}</span>
                    </div>
                    <iframe
                        title="${title ?? 'Nørd playground preview'}"
                        class="aurora-code-editor-frame"
                        sandbox="allow-scripts allow-same-origin"
                        srcdoc="${preview}"
                    ></iframe>
                </div>
            </div>
        </section>
    `;
};

export default CodeEditor;
