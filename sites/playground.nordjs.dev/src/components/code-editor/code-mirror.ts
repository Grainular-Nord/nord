import {
    autocompletion,
    type CompletionSource,
    closeBrackets,
    closeBracketsKeymap,
    completionKeymap,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { bracketMatching, foldGutter, HighlightStyle, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { type Diagnostic, lintGutter, setDiagnostics } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { EditorView, hoverTooltip, keymap, lineNumbers } from '@codemirror/view';
import type { Grain } from '@grainular/grains';
import { html, mounted } from '@grainular/nord';
import { tags } from '@lezer/highlight';
import { taggedTemplateHighlighting } from './tagged-template-highlighting';
import type { PlaygroundDiagnostic, ProjectFile } from './types';
import { createTypeScriptService } from './typescript-service';

const editorTheme = EditorView.theme(
    {
        '&': {
            height: '100%',
            color: 'var(--aurora-syntax-foreground)',
            backgroundColor: 'var(--aurora-syntax-background)',
        },
        '.cm-scroller': { fontFamily: 'var(--aurora-font-mono)', lineHeight: '1.6' },
        '.cm-content': { padding: '0.9rem 0' },
        '.cm-line': { padding: '0 1rem' },
        '.cm-gutters': {
            minWidth: '3rem',
            color: 'var(--aurora-text-faint)',
            backgroundColor: 'var(--aurora-syntax-background)',
            border: 'none',
        },
        '.cm-gutterElement': { padding: '0 0.75rem 0 0.5rem' },
        '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--aurora-overlay)' },
        '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--aurora-accent)' },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
            backgroundColor: 'color-mix(in srgb, var(--aurora-accent), transparent 78%)',
        },
        // Template markup is nested inside JavaScript string spans. Targeting
        // descendants makes the tagged-template decoration win over that base
        // string colour instead of appearing indistinguishable from it.
        '.cm-nord-template-tag, .cm-nord-template-tag *': { color: 'var(--aurora-syntax-token-comment) !important' },
        '.cm-nord-template-text, .cm-nord-template-text *': { color: 'var(--aurora-syntax-foreground) !important' },
        '.cm-nord-template-element, .cm-nord-template-element *': {
            color: 'var(--aurora-syntax-token-string-expression) !important',
        },
        '.cm-nord-template-attribute, .cm-nord-template-attribute *': {
            color: 'var(--aurora-syntax-foreground) !important',
        },
        '.cm-nord-template-value, .cm-nord-template-value *': {
            color: 'var(--aurora-syntax-token-string-expression) !important',
        },
        '.cm-nord-template-interpolation, .cm-nord-template-interpolation *': {
            color: 'var(--aurora-syntax-token-string-expression) !important',
        },
        '.cm-nord-template-callable, .cm-nord-template-callable *': {
            color: 'var(--aurora-syntax-token-function) !important',
        },
        '.cm-nord-template-operator, .cm-nord-template-operator *': {
            color: 'var(--aurora-syntax-token-keyword) !important',
        },
        '.cm-nord-definition-constant, .cm-nord-definition-constant *': {
            color: 'var(--aurora-syntax-token-constant) !important',
        },
        '.cm-nord-definition-function, .cm-nord-definition-function *': {
            color: 'var(--aurora-syntax-token-function) !important',
        },
        '.cm-tooltip.cm-tooltip-autocomplete, .cm-tooltip.cm-tooltip-hover': {
            color: 'var(--aurora-syntax-foreground)',
            backgroundColor: 'var(--aurora-surface)',
            border: '1px solid var(--aurora-border)',
            boxShadow: '0 0.75rem 1.5rem color-mix(in srgb, black, transparent 65%)',
        },
        '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
            color: 'var(--aurora-syntax-foreground)',
            backgroundColor: 'color-mix(in srgb, var(--aurora-accent), transparent 82%)',
            boxShadow: 'inset 2px 0 var(--aurora-accent)',
        },
        '.cm-completionDetail': { color: 'var(--aurora-text-faint)' },
        '.cm-nord-type-hint': { padding: '0.35rem 0.5rem', fontFamily: 'var(--aurora-font-mono)' },
        '&.cm-focused': { outline: 'none' },
    },
    { dark: true },
);

const editorHighlight = HighlightStyle.define([
    { tag: tags.comment, color: 'var(--aurora-syntax-token-comment)', fontStyle: 'italic' },
    {
        tag: [tags.keyword, tags.controlKeyword, tags.operator, tags.operatorKeyword],
        color: 'var(--aurora-syntax-token-keyword)',
    },
    { tag: [tags.string, tags.special(tags.string)], color: 'var(--aurora-syntax-token-string-expression)' },
    { tag: [tags.number, tags.bool, tags.null], color: 'var(--aurora-syntax-token-constant)' },
    { tag: [tags.function(tags.variableName), tags.labelName], color: 'var(--aurora-syntax-token-function)' },
    { tag: [tags.punctuation, tags.separator], color: 'var(--aurora-syntax-token-punctuation)' },
]);

export const CodeMirrorEditor = ({
    diagnostics,
    file,
    files,
    onChange,
    onFormat,
    onRun,
}: {
    diagnostics: Grain<PlaygroundDiagnostic[]>;
    file: Grain<ProjectFile | undefined>;
    files: Grain<ProjectFile[]>;
    onChange: (contents: string) => void;
    onFormat: () => void;
    onRun: () => void;
}) => {
    let view: EditorView | undefined;
    let path: string | undefined;
    const typeScript = createTypeScriptService();

    const completions: CompletionSource = async (context) => {
        const requestedPath = path;
        if (!requestedPath) return null;

        const before = context.matchBefore(/[\w$]*/);
        if (!context.explicit && !before?.text) return null;

        const result = await typeScript.completions(requestedPath, context.pos);
        if (context.aborted || path !== requestedPath || !result?.length) return null;

        return {
            from: before?.from ?? context.pos,
            options: result.map((completion) => ({
                detail: completion.detail,
                label: completion.label,
                type: completion.type,
            })),
            validFor: /[\w$]*/,
        };
    };

    const typeHints = hoverTooltip(
        async (_view, position) => {
            const requestedPath = path;
            if (!requestedPath) return null;

            const result = await typeScript.quickInfo(requestedPath, position);
            if (path !== requestedPath || !result) return null;

            return {
                pos: result.start,
                end: result.end,
                create: () => {
                    const dom = document.createElement('div');
                    dom.className = 'cm-nord-type-hint';
                    dom.textContent = result.text;
                    return { dom };
                },
            };
        },
        { hideOnChange: true },
    );

    const editorDiagnostics = (current: ProjectFile, values: PlaygroundDiagnostic[]): Diagnostic[] =>
        values
            .filter((diagnostic) => diagnostic.path === current.path)
            .flatMap((diagnostic) => {
                if (diagnostic.line > current.contents.split('\n').length) return [];
                const line = view?.state.doc.line(diagnostic.line);
                if (!line) return [];
                const from = Math.min(line.from + diagnostic.column, line.to);
                return [
                    {
                        from,
                        message: diagnostic.message,
                        severity: 'error',
                        to: Math.min(from + diagnostic.length, line.to),
                    },
                ];
            });

    const syncDiagnostics = (current: ProjectFile | undefined, values: PlaygroundDiagnostic[]) => {
        if (current && view) view.dispatch(setDiagnostics(view.state, editorDiagnostics(current, values)));
    };

    const createState = (current: ProjectFile) =>
        EditorState.create({
            doc: current.contents,
            extensions: [
                lineNumbers(),
                history(),
                javascript({ typescript: true }),
                bracketMatching(),
                closeBrackets(),
                indentOnInput(),
                foldGutter(),
                lintGutter(),
                autocompletion({ override: [completions] }),
                typeHints,
                syntaxHighlighting(editorHighlight),
                taggedTemplateHighlighting(['html']),
                keymap.of([
                    ...defaultKeymap,
                    ...historyKeymap,
                    ...closeBracketsKeymap,
                    ...completionKeymap,
                    indentWithTab,
                    {
                        key: 'Mod-s',
                        run: () => {
                            onFormat();
                            return true;
                        },
                    },
                    {
                        key: 'Mod-Enter',
                        run: () => {
                            onRun();
                            return true;
                        },
                    },
                ]),
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
        } else if (path !== current.path || view.state.doc.toString() !== current.contents) {
            path = current.path;
            view.setState(createState(current));
        }
        syncDiagnostics(current, diagnostics());
    };

    const setup = mounted((host) => {
        const unsubscribeFile = file.subscribe((current) => sync(current, host));
        const unsubscribeFiles = files.subscribe((project) => typeScript.sync(project));
        const unsubscribeDiagnostics = diagnostics.subscribe((values) => syncDiagnostics(file(), values));
        sync(file(), host);
        typeScript.sync(files());
        return () => {
            unsubscribeFile();
            unsubscribeFiles();
            unsubscribeDiagnostics();
            typeScript.destroy();
            view?.destroy();
        };
    });

    return html`<div class="aurora-code-editor-pane" ${setup}></div>`;
};
