// Public types shared by the editor engine and default components.
import type { Extension } from '@codemirror/state';
import type { ComponentFragment } from '@grainular/nord';

/** A zero-based location reported by preview compilation for one virtual file. */
export type EditorDiagnostic = {
    column: number;
    length: number;
    line: number;
    message: string;
    path: string;
};

/** A source file in the editor's virtual `src` project. Paths are relative to `src`. */
export type EditorFile = { contents: string; path: string };
/** The two default workspace arrangements. */
export type EditorLayout = 'split' | 'stacked';
/** A console event received from the sandboxed preview iframe. */
export type EditorPreviewEvent = { level: 'error' | 'info' | 'log' | 'warn'; message: string };
/** The postMessage envelope used to associate preview events with the active run. */
export type EditorPreviewMessage = { channel: 'nord-playground'; event: EditorPreviewEvent; session: string };
/** A button rendered in the default preview toolbar. */
export type EditorTool = { id: string; label: string; run: () => void | Promise<void>; title?: string };
/**
 * Lazily creates a toolbar button from the live engine. Returning `undefined`
 * omits the tool, which makes feature flags declarative in host configuration.
 */
export type EditorToolDefinition<Engine> = (engine: Engine) => EditorTool | undefined;

/** Files supplied directly or loaded once when the editor mounts. */
export type EditorProjectSource = EditorFile[] | (() => Promise<EditorFile[]>);

/** Optional theme tokens and CodeMirror extensions accepted by `EditorWorkspace`. */
export type EditorTheme = {
    className?: string;
    codeMirror?: Extension[];
    /** Overrides for the `--grainular-editor-*` custom properties defined in `theme.css`. */
    tokens?: Partial<{
        accent: string;
        background: string;
        border: string;
        'border-strong': string;
        foreground: string;
        'font-mono': string;
        overlay: string;
        surface: string;
        'syntax-foreground': string;
        'text-faint': string;
        'text-muted': string;
        'token-comment': string;
        'token-constant': string;
        'token-function': string;
        'token-keyword': string;
        'token-punctuation': string;
        'token-string': string;
    }>;
};

/** Replaceable regions of the low-level workspace shell. */
export type EditorWorkspaceSlots = {
    panel?: () => ComponentFragment;
    sidebar?: () => ComponentFragment;
    status?: () => ComponentFragment;
    toolbarEnd?: () => ComponentFragment;
    toolbarStart?: () => ComponentFragment;
};
