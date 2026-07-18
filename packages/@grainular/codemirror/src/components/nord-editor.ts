import type { NordEditorEngine } from '../core/engine';
import type { EditorTheme } from '../core/types';
import { CodeMirrorEditor } from './code-mirror';
import { PreviewPanel } from './preview-panel';
import CodeMirrorWorkspace from './workspace';

/**
 * Ready-to-use Nørd editor composition.
 *
 * Use this for the standard file tree, CodeMirror editor, resizable preview,
 * console, and toolbar. Consumers configure `engine`; tutorial-specific UI is
 * expressed as engine tools rather than duplicated editor markup. `theme`
 * overrides the package's built-in tokens (see `theme.css`) for hosts that
 * want a different palette instead of the automatic host-CSS fallback.
 */
export const NordEditor = ({
    engine,
    theme,
    title,
}: {
    engine: NordEditorEngine;
    theme?: EditorTheme;
    title?: string;
}) =>
    CodeMirrorWorkspace({
        activePath: engine.activePath,
        editor: CodeMirrorEditor({
            diagnostics: engine.diagnostics,
            file: engine.activeFile,
            files: engine.files,
            onChange: engine.updateActiveFile,
            onFormat: () => void engine.format(),
            onRun: () => void engine.run(),
        }),
        files: engine.files,
        layout: engine.layout,
        onAdd: engine.addFile,
        onDelete: engine.deleteFile,
        onRename: engine.renameFile,
        panel: PreviewPanel({
            consoleOpen: engine.consoleOpen,
            layout: engine.layout,
            preview: engine.preview,
            previewEvents: engine.previewEvents,
            session: engine.previewSession,
            status: engine.status,
            title,
            tools: engine.tools(),
        }),
        setup: engine.load,
        theme,
    });
