import type { WritableGrain } from '@grainular/grains';
import type { ComponentFragment, Fragment } from '@grainular/nord';
import { html } from '@grainular/nord';
import type { EditorFile, EditorLayout, EditorTheme, EditorWorkspaceSlots } from '../core/types';
import { EditorProjectTree } from './project-tree';
import { EditorResizeHandle } from './resize-handle';

/** Converts JS theme tokens to CSS custom properties understood by theme.css. */
const themeStyle = (theme: EditorTheme | undefined) => {
    if (!theme?.tokens) return undefined;
    return Object.entries(theme.tokens)
        .map(([name, value]) => `--grainular-editor-${name}:${value}`)
        .join(';');
};

/**
 * The structural shell for a complete editor workspace. Hosts can replace
 * every chrome region while retaining predictable data attributes for themes.
 */
export const EditorWorkspace = ({
    editor,
    slots = {},
    theme,
}: {
    editor: ComponentFragment;
    slots?: EditorWorkspaceSlots;
    theme?: EditorTheme;
}) =>
    html`<section
        class="grainular-codemirror ${theme?.className ?? ''}"
        data-grainular-editor="workspace"
        style="${themeStyle(theme)}"
    >
        <header data-grainular-editor="toolbar">
            <div data-grainular-editor="toolbar-start">${slots.toolbarStart?.()}</div>
            <div data-grainular-editor="toolbar-end">${slots.toolbarEnd?.()}</div>
        </header>
        <div data-grainular-editor="body">
            ${slots.sidebar && html`<aside data-grainular-editor="sidebar">${slots.sidebar()}</aside>`}
            <main data-grainular-editor="editor">${editor}</main>
            ${slots.panel && html`<aside data-grainular-editor="panel">${slots.panel()}</aside>`}
        </div>
        ${slots.status && html`<footer data-grainular-editor="status">${slots.status()}</footer>`}
    </section>`;

/**
 * The standard workspace layout used by `NordEditor`.
 *
 * This is intentionally separate from `EditorWorkspace`: the latter is a
 * structural slot shell, while this component wires the package's file tree,
 * resize handle, and panel together.
 */
const CodeMirrorWorkspace = ({
    activePath,
    editor,
    files,
    layout,
    onAdd,
    onDelete,
    onRename,
    panel,
    setup,
    theme,
}: {
    activePath: WritableGrain<string | undefined>;
    editor: ComponentFragment;
    files: WritableGrain<EditorFile[]>;
    layout: WritableGrain<EditorLayout>;
    onAdd: (name: string) => void;
    onDelete: (path: string) => void;
    onRename: (path: string, name: string) => boolean;
    panel: ComponentFragment;
    setup?: Fragment;
    theme?: EditorTheme;
}) =>
    html`<section
        class="grainular-codemirror"
        data-grainular-editor="workspace"
        data-layout="${layout}"
        style="${themeStyle(theme)}"
        ${setup}
    >
        <div data-grainular-editor="workspace-body">
            ${EditorProjectTree({ activePath, files, onAdd, onDelete, onRename })}
            <main data-grainular-editor="editor">${editor}</main>
            ${EditorResizeHandle({ layout })}
            <aside data-grainular-editor="panel">${panel}</aside>
        </div>
    </section>`;

export default CodeMirrorWorkspace;
